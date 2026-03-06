/**
 * ═══════════════════════════════════════════════════════════
 *  FrostBite Ice-Cream Shop — Backend Server
 *  Built with Node.js built-in modules only (no dependencies).
 *
 *  Endpoints:
 *    POST /order   — Save a new order to orders.json
 *    GET  /orders  — Return all saved orders
 *
 *  Run with:  node server.js
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

// ── Built-in Node.js modules ─────────────────────────────
const http = require('http');   // Core HTTP server
const fs = require('fs');     // File-system: read / write files
const path = require('path');   // Cross-platform file paths
const crypto = require('crypto'); // Generates random order IDs

// ── Configuration ────────────────────────────────────────
const PORT = 5000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// ════════════════════════════════════════════════════════════
//  HELPER: Read all orders from orders.json
//  • Returns an empty array [] if the file doesn't exist yet
//  • Returns an empty array []  if the file is corrupted
// ════════════════════════════════════════════════════════════
function readOrders() {
    // If orders.json doesn't exist yet, just return an empty array
    if (!fs.existsSync(ORDERS_FILE)) {
        return [];
    }

    try {
        const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
        const data = JSON.parse(raw);

        // Ensure the file contains an array (safety check)
        return Array.isArray(data) ? data : [];
    } catch (err) {
        // File existed but couldn't be parsed — treat as empty
        console.error('⚠️  Could not parse orders.json:', err.message);
        return [];
    }
}

// ════════════════════════════════════════════════════════════
//  HELPER: Write the orders array back to orders.json
//  • Creates the file automatically if it doesn't exist
//  • Uses JSON.stringify with 2-space indent for readability
// ════════════════════════════════════════════════════════════
function writeOrders(orders) {
    const json = JSON.stringify(orders, null, 2); // Pretty-print
    fs.writeFileSync(ORDERS_FILE, json, 'utf8');
}

// ════════════════════════════════════════════════════════════
//  HELPER: Generate a unique order ID
//  Example output:  "ORD-A3F9C1"
// ════════════════════════════════════════════════════════════
function generateOrderId() {
    // Generate 3 random bytes → 6 uppercase hex characters
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${randomHex}`;
}

// ════════════════════════════════════════════════════════════
//  HELPER: Send a JSON response
//  Handles headers + body in one call
// ════════════════════════════════════════════════════════════
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        // CORS headers — allows the frontend (any origin) to call this API
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data, null, 2));
}

// ════════════════════════════════════════════════════════════
//  HELPER: Read the full request body as a string
//  Returns a Promise that resolves with the body text
// ════════════════════════════════════════════════════════════
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        // Data arrives in chunks — collect them
        req.on('data', chunk => { body += chunk.toString(); });

        // All chunks received — resolve the promise
        req.on('end', () => resolve(body));

        // Something went wrong — reject the promise
        req.on('error', err => reject(err));
    });
}

// ════════════════════════════════════════════════════════════
//  ROUTE HANDLERS
// ════════════════════════════════════════════════════════════

/**
 * POST /order
 *
 * Receives an order from the frontend cart checkout.
 *
 * Expected request body (JSON):
 *  {
 *    "items": [
 *      { "id": 1, "name": "Classic Chocolate", "price": 299, "qty": 2 },
 *      ...
 *    ],
 *    "total": 598
 *  }
 *
 * Saves the order to orders.json with an auto-generated
 * orderId and a timestamp, then returns the saved order.
 */
async function handlePostOrder(req, res) {
    try {
        // 1. Read the raw request body text
        const rawBody = await readBody(req);

        // 2. Parse the JSON body
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return sendJSON(res, 400, {
                success: false,
                message: 'Invalid JSON in request body.',
            });
        }

        // 3. Validate — items must be a non-empty array
        const { items, total } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return sendJSON(res, 400, {
                success: false,
                message: 'Order must contain at least one item.',
            });
        }

        if (typeof total !== 'number' || total <= 0) {
            return sendJSON(res, 400, {
                success: false,
                message: '"total" must be a positive number.',
            });
        }

        // 4. Build the complete order object
        const newOrder = {
            orderId: generateOrderId(),             // e.g.  "ORD-A3F9C1"
            items: items,                         // Array from the cart
            total: total,                         // Total in ₹
            createdAt: new Date().toISOString(),      // e.g.  "2026-03-06T18:20:00.000Z"
        };

        // 5. Load existing orders, append new one, and save back
        const orders = readOrders();
        orders.push(newOrder);
        writeOrders(orders);

        // 6. Log to server console for visibility
        console.log(`✅  New order saved: ${newOrder.orderId}  |  ₹${newOrder.total}  |  ${newOrder.items.length} item(s)`);

        // 7. Respond with the saved order + success message
        sendJSON(res, 201, {
            success: true,
            message: 'Order placed successfully! 🎉',
            order: newOrder,
        });

    } catch (err) {
        // Unexpected server error
        console.error('❌  Error in POST /order:', err.message);
        sendJSON(res, 500, {
            success: false,
            message: 'Internal server error. Please try again.',
        });
    }
}

/**
 * GET /orders
 *
 * Returns all saved orders from orders.json.
 * Returns an empty array [] if no orders exist yet.
 *
 * Response:
 *  {
 *    "success": true,
 *    "count": 3,
 *    "orders": [ ... ]
 *  }
 */
function handleGetOrders(req, res) {
    try {
        const orders = readOrders();

        console.log(`📋  GET /orders — returning ${orders.length} order(s)`);

        sendJSON(res, 200, {
            success: true,
            count: orders.length,
            orders: orders,
        });

    } catch (err) {
        console.error('❌  Error in GET /orders:', err.message);
        sendJSON(res, 500, {
            success: false,
            message: 'Could not retrieve orders.',
        });
    }
}

// ════════════════════════════════════════════════════════════
//  MAIN HTTP SERVER
//  All requests enter here and are routed to the correct handler
// ════════════════════════════════════════════════════════════
const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    // ── CORS Pre-flight (browser sends OPTIONS before POST) ──
    // Without this, browser CORS checks will fail
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return res.end();
    }

    // ── Route: POST /order ───────────────────────────────────
    if (method === 'POST' && url === '/order') {
        return handlePostOrder(req, res);
    }

    // ── Route: GET /orders ───────────────────────────────────
    if (method === 'GET' && url === '/orders') {
        return handleGetOrders(req, res);
    }

    // ── Route: GET / (health check / welcome) ────────────────
    if (method === 'GET' && url === '/') {
        return sendJSON(res, 200, {
            message: '🍦 FrostBite Ice-Cream Shop API is running!',
            endpoints: {
                'POST /order': 'Place a new order',
                'GET  /orders': 'Retrieve all saved orders',
            },
        });
    }

    // ── 404 — Unknown route ──────────────────────────────────
    sendJSON(res, 404, {
        success: false,
        message: `Route not found: ${method} ${url}`,
    });
});

// ════════════════════════════════════════════════════════════
//  START THE SERVER
// ════════════════════════════════════════════════════════════
server.listen(PORT, () => {
    console.log('');
    console.log('🍧 ════════════════════════════════════════════');
    console.log(`🍦  FrostBite Backend running on port ${PORT}`);
    console.log('🍧 ════════════════════════════════════════════');
    console.log(`   ➜  http://localhost:${PORT}/`);
    console.log(`   ➜  POST http://localhost:${PORT}/order`);
    console.log(`   ➜  GET  http://localhost:${PORT}/orders`);
    console.log('');
    console.log(`📁  Orders will be saved to: ${ORDERS_FILE}`);
    console.log('');
});

// ── Graceful shutdown on Ctrl+C ──────────────────────────
process.on('SIGINT', () => {
    console.log('\n👋  Server shutting down gracefully...');
    server.close(() => {
        console.log('   Server closed. Goodbye! 🍦');
        process.exit(0);
    });
});