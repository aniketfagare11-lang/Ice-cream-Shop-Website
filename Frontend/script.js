'use strict';

/* ══════════════════════════════════════════════════
   MENU DATA
   Each item: id, name, emoji, price, originalPrice,
   desc, category, tags, badge, badgeClass, rating
══════════════════════════════════════════════════ */
const MENU = [
    {
        id: 1,
        name: 'Classic Chocolate',
        emoji: '🍫',
        price: 299,          // ₹299
        originalPrice: null,
        desc: 'Rich Belgian chocolate swirled into ultra-creamy ice cream. Dark, velvety & irresistible.',
        category: 'Classic',
        tags: ['Bestseller', 'No nuts'],
        badge: '⭐ Fan Fave',
        badgeClass: 'badge-yellow',
        rating: '4.9'
    },
    {
        id: 2,
        name: 'Dreamy Vanilla',
        emoji: '🍦',
        price: 249,          // ₹249
        originalPrice: null,
        desc: 'Pure Madagascar vanilla bean ice cream — simple, sweet & eternally timeless.',
        category: 'Classic',
        tags: ['Egg-free', 'Mild'],
        badge: null,
        badgeClass: '',
        rating: '4.7'
    },
    {
        id: 3,
        name: 'Wild Strawberry',
        emoji: '🍓',
        price: 279,          // ₹279
        originalPrice: null,
        desc: 'Bursting with real strawberry chunks in a gorgeous rosy cream base.',
        category: 'Fruity',
        tags: ['Fruity', 'Fresh'],
        badge: '🔥 Trending',
        badgeClass: '',
        rating: '4.8'
    },
    {
        id: 4,
        name: 'Tropical Mango',
        emoji: '🥭',
        price: 319,          // ₹319 (discounted from ₹399)
        originalPrice: 399,
        desc: 'Sun-ripened Alphonso mangoes churned into a silky, tangy tropical sorbet.',
        category: 'Fruity',
        tags: ['Vegan', 'Fruity'],
        badge: '🌴 New',
        badgeClass: 'badge-green',
        rating: '4.9'
    },
    {
        id: 5,
        name: 'Matcha Dream',
        emoji: '🍵',
        price: 349,          // ₹349
        originalPrice: null,
        desc: 'Ceremonial-grade matcha whisked into ultra-creamy ice cream. Earthy & refined.',
        category: 'Premium',
        tags: ['Artisan', 'Earthy'],
        badge: '🌿 Artisan',
        badgeClass: 'badge-green',
        rating: '4.8'
    },
    {
        id: 6,
        name: 'Cookies & Cream',
        emoji: '🍪',
        price: 309,          // ₹309
        originalPrice: null,
        desc: 'Crunchy Oreo pieces folded into a smooth vanilla cream base. A nostalgic classic.',
        category: 'Classic',
        tags: ['Crunchy', 'Kids fave'],
        badge: null,
        badgeClass: '',
        rating: '4.9'
    },
    {
        id: 7,
        name: 'Blueberry Bliss',
        emoji: '🫐',
        price: 329,          // ₹329
        originalPrice: null,
        desc: 'Wild blueberries swirled with tangy cream cheese ice cream. Dreamy and delicious.',
        category: 'Fruity',
        tags: ['Tangy', 'Antioxidant'],
        badge: null,
        badgeClass: '',
        rating: '4.6'
    },
    {
        id: 8,
        name: 'Peach Parfait',
        emoji: '🍑',
        price: 289,          // ₹289
        originalPrice: null,
        desc: 'Georgia peaches blended with a hint of ginger. The smoothest summer treat.',
        category: 'Fruity',
        tags: ['Seasonal', 'Mild'],
        badge: '☀️ Seasonal',
        badgeClass: 'badge-yellow',
        rating: '4.7'
    },
    {
        id: 9,
        name: 'Pistachio Royale',
        emoji: '🌿',
        price: 449,          // ₹449
        originalPrice: null,
        desc: 'Sicilian pistachios ground into a luxuriously smooth, nutty ice cream.',
        category: 'Premium',
        tags: ['Luxury', 'Nutty'],
        badge: '👑 Premium',
        badgeClass: '',
        rating: '4.9'
    },
    {
        id: 10,
        name: 'Mint Choco Chip',
        emoji: '🌱',
        price: 299,          // ₹299
        originalPrice: null,
        desc: 'Cool mint cream packed with dark chocolate chips. Refreshingly indulgent.',
        category: 'Classic',
        tags: ['Refreshing', 'Chocolate'],
        badge: null,
        badgeClass: '',
        rating: '4.7'
    },
    {
        id: 11,
        name: 'Lychee Sorbet',
        emoji: '🍈',
        price: 369,          // ₹369 (discounted from ₹449)
        originalPrice: 449,
        desc: 'Delicate lychee sorbet — light, floral and refreshingly dairy-free.',
        category: 'Premium',
        tags: ['Vegan', 'Dairy-free'],
        badge: '💎 Limited',
        badgeClass: '',
        rating: '4.8'
    },
    {
        id: 12,
        name: 'Rocky Road',
        emoji: '🍬',
        price: 339,          // ₹339
        originalPrice: null,
        desc: 'Chocolate ice cream with marshmallows, almonds & fudge swirls. Pure chaos, pure joy.',
        category: 'Classic',
        tags: ['Chunky', 'Indulgent'],
        badge: null,
        badgeClass: '',
        rating: '4.8'
    }
];

/* ══════════════════════════════════════════════════
   CART STATE
   cart = array of { id, name, emoji, price, qty }
══════════════════════════════════════════════════ */
let cart = [];

/* Current search query and active category filter */
let searchQuery = '';
let activeCategory = 'All';

/* ══════════════════════════════════════════════════
   UNIQUE CATEGORIES
══════════════════════════════════════════════════ */
const CATEGORIES = ['All', ...new Set(MENU.map(i => i.category))];

/* ══════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════ */
const menuGrid = document.getElementById('menuGrid');
const menuSub = document.getElementById('menuSub');
const noResults = document.getElementById('noResults');
const noResultsTerm = document.getElementById('noResultsTerm');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryPillsCont = document.getElementById('categoryPills');

// Cart drawer elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartTrigger = document.getElementById('cartTrigger');
const cdClose = document.getElementById('cdClose');
const cdBody = document.getElementById('cdBody');
const cdEmpty = document.getElementById('cdEmpty');
const cdCount = document.getElementById('cdCount');
const cdFooter = document.getElementById('cdFooter');
const cdSubtotal = document.getElementById('cdSubtotal');
const cdTotal = document.getElementById('cdTotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const btnCheckout = document.getElementById('btnCheckout');

// Nav badge
const ctBadge = document.getElementById('ctBadge');

// Search inputs
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchClear = document.getElementById('mobileSearchClear');
const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileSearchBar = document.getElementById('mobileSearchBar');
const inlineSearchInput = document.getElementById('inlineSearchInput');
const inlineSearchClear = document.getElementById('inlineSearchClear');

// Navbar
const navbar = document.getElementById('navbar');

// Toast container
const toastStack = document.getElementById('toastStack');

/* ══════════════════════════════════════════════════
   CART OPEN / CLOSE
══════════════════════════════════════════════════ */

/** Open the cart drawer */
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('show');
    cartDrawer.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
}

/** Close the cart drawer */
function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('show');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

cartTrigger.addEventListener('click', openCart);
cdClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
});

/* ══════════════════════════════════════════════════
   CART HELPERS
══════════════════════════════════════════════════ */

/**
 * Find a cart item by id
 * @param {number} id
 * @returns {object|undefined}
 */
function getCartItem(id) {
    return cart.find(item => item.id === id);
}

/**
 * Get total quantity in cart
 * @returns {number}
 */
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Get cart total price
 * @returns {number}
 */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ══════════════════════════════════════════════════
   ADD TO CART
══════════════════════════════════════════════════ */

/**
 * Add one unit of an item to cart
 * @param {number} id — menu item id
 */
function addToCart(id) {
    const menuItem = MENU.find(m => m.id === id);
    if (!menuItem) return;

    const existing = getCartItem(id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            emoji: menuItem.emoji,
            price: menuItem.price,
            qty: 1
        });
    }

    updateCartUI();
    updateCardAction(id);
    animateBadge();
    showToast(`${menuItem.emoji} ${menuItem.name} added!`);
}

/* ══════════════════════════════════════════════════
   INCREASE / DECREASE QUANTITY
══════════════════════════════════════════════════ */

/**
 * Change quantity of a cart item by delta (+1 or -1)
 * If qty reaches 0, remove the item from cart
 * @param {number} id
 * @param {number} delta — +1 or -1
 */
function changeQty(id, delta) {
    const item = getCartItem(id);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        // Remove item entirely
        cart = cart.filter(i => i.id !== id);
        showToast(`${item.emoji} Removed from cart`, 'error');
    }

    updateCartUI();
    updateCardAction(id);     // sync card button state
    animateBadge();
}

/* ══════════════════════════════════════════════════
   UPDATE CART UI (drawer + badge + totals)
══════════════════════════════════════════════════ */
function updateCartUI() {
    const count = getCartCount();
    const total = getCartTotal();

    // Nav badge
    ctBadge.textContent = count;
    ctBadge.dataset.count = count;

    // Drawer item count label
    cdCount.textContent = count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`;

    // Drawer body
    renderCartItems();

    // Footer totals — formatted as Indian Rupees (e.g. ₹299)
    const fmt = v => '₹' + v;
    cdSubtotal.textContent = fmt(total);
    cdTotal.textContent = fmt(total);
    checkoutTotal.textContent = fmt(total);

    // Show/hide footer
    cdFooter.classList.toggle('show', cart.length > 0);
}

/* ══════════════════════════════════════════════════
   RENDER CART ITEMS (inside drawer)
══════════════════════════════════════════════════ */
function renderCartItems() {
    // Remove existing item cards (keep empty state div)
    const existing = cdBody.querySelectorAll('.ci-card');
    existing.forEach(el => el.remove());

    if (cart.length === 0) {
        cdEmpty.style.display = 'flex';
        return;
    }

    cdEmpty.style.display = 'none';

    cart.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ci-card';
        card.id = `ci-${item.id}`;

        card.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">₹${item.price} each</div>
        <div class="ci-subtotal">Subtotal: ₹${item.price * item.qty}</div>
      </div>
      <div class="qty-ctrl" role="group" aria-label="Quantity for ${item.name}">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
        <span class="qty-num" aria-live="polite">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
      </div>
    `;

        cdBody.appendChild(card);
    });

    // Attach quantity button events
    cdBody.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            const delta = parseInt(btn.dataset.delta, 10);
            changeQty(id, delta);
        });
    });
}

/* ══════════════════════════════════════════════════
   UPDATE CARD ACTION BUTTON
   Switches between "Add to Cart" button and inline
   qty control based on whether item is in cart
══════════════════════════════════════════════════ */
function updateCardAction(id) {
    const actionEl = document.getElementById(`action-${id}`);
    if (!actionEl) return;

    const item = getCartItem(id);

    if (!item) {
        // Show Add button
        actionEl.innerHTML = `
      <button class="btn-add-card" data-id="${id}" aria-label="Add to cart">
        Add to Cart
      </button>
    `;
        actionEl.querySelector('.btn-add-card').addEventListener('click', () => addToCart(id));
    } else {
        // Show inline qty control
        actionEl.innerHTML = `
      <div class="card-qty-ctrl" role="group" aria-label="Quantity">
        <button class="cqc-btn remove-btn" data-id="${id}" data-delta="-1" aria-label="Decrease">−</button>
        <span class="cqc-num" aria-live="polite">${item.qty}</span>
        <button class="cqc-btn" data-id="${id}" data-delta="1" aria-label="Increase">+</button>
      </div>
    `;
        actionEl.querySelectorAll('.cqc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.id, 10);
                const delta = parseInt(btn.dataset.delta, 10);
                changeQty(itemId, delta);
            });
        });
    }
}

/* ══════════════════════════════════════════════════
   BADGE POP ANIMATION
══════════════════════════════════════════════════ */
function animateBadge() {
    ctBadge.classList.remove('pop');
    void ctBadge.offsetWidth; // force reflow
    ctBadge.classList.add('pop');
}

/* ══════════════════════════════════════════════════
   PLACE ORDER
══════════════════════════════════════════════════ */
btnCheckout.addEventListener('click', async () => {

    if (cart.length === 0) {
        showToast('🛒 Your cart is empty!', 'error');
        return;
    }

    const total = getCartTotal();

    try {

        await fetch("http://localhost:5000/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: cart,
                total: total
            })
        })

    } catch (err) {
        showToast("❌ Server error", "error")
        return
    }

    // cart clear
    cart = []
    updateCartUI()

    // reset buttons
    MENU.forEach(item => updateCardAction(item.id))

    closeCart()

    showToast(`🎉 Order placed! Your ice cream is on the way 🍦  Total: ₹${total}`, "success")

})

/* ══════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════ */

/**
 * Handle search input from any search field.
 * Syncs all search fields to the same query.
 * @param {string} query
 */
function handleSearch(query) {
    searchQuery = query.trim().toLowerCase();

    // Sync all search inputs
    [searchInput, mobileSearchInput, inlineSearchInput].forEach(input => {
        if (input && input.value !== query) input.value = query;
    });

    // Show/hide clear buttons
    const hasTerm = query.length > 0;
    [searchClear, mobileSearchClear, inlineSearchClear].forEach(btn => {
        if (btn) btn.style.display = hasTerm ? 'flex' : 'none';
    });

    renderMenu();
}

/** Clear all search inputs */
function clearSearch() {
    handleSearch('');
}

// Attach search events
[searchInput, mobileSearchInput, inlineSearchInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', e => handleSearch(e.target.value));
    // Clear on pressing Escape inside input
    input.addEventListener('keydown', e => { if (e.key === 'Escape') clearSearch(); });
});

[searchClear, mobileSearchClear, inlineSearchClear].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', clearSearch);
});

clearSearchBtn.addEventListener('click', clearSearch);

/* ══════════════════════════════════════════════════
   CATEGORY FILTER
══════════════════════════════════════════════════ */

/** Build category filter pills */
function buildCategoryPills() {
    const icons = { All: '🍧', Classic: '🍦', Fruity: '🍓', Premium: '👑' };

    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-pill' + (cat === 'All' ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', cat === 'All' ? 'true' : 'false');
        btn.dataset.cat = cat;
        btn.innerHTML = `${icons[cat] || '•'} ${cat}`;
        btn.addEventListener('click', () => setCategory(cat));
        categoryPillsCont.appendChild(btn);
    });
}

/** Set active category and re-render */
function setCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(p => {
        const isActive = p.dataset.cat === cat;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderMenu();
}

/* ══════════════════════════════════════════════════
   RENDER MENU
══════════════════════════════════════════════════ */
function renderMenu() {
    // Filter by category
    let filtered = activeCategory === 'All'
        ? MENU
        : MENU.filter(item => item.category === activeCategory);

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.desc.toLowerCase().includes(searchQuery) ||
            item.tags.some(t => t.toLowerCase().includes(searchQuery)) ||
            item.category.toLowerCase().includes(searchQuery)
        );
    }

    // Update subtitle
    if (searchQuery) {
        menuSub.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`;
    } else if (activeCategory === 'All') {
        menuSub.textContent = `Showing all ${filtered.length} flavours`;
    } else {
        menuSub.textContent = `${filtered.length} ${activeCategory} flavour${filtered.length !== 1 ? 's' : ''}`;
    }

    // No results state
    if (filtered.length === 0) {
        menuGrid.style.display = 'none';
        noResults.style.display = 'flex';
        noResultsTerm.textContent = searchQuery || activeCategory;
        return;
    }

    menuGrid.style.display = 'grid';
    noResults.style.display = 'none';

    // Build cards
    menuGrid.innerHTML = '';
    filtered.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = 'menu-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', item.name);
        card.style.animationDelay = `${index * 0.06}s`;

        const badgeHTML = item.badge
            ? `<div class="mc-badge ${item.badgeClass}">${item.badge}</div>`
            : '';

        const origPriceHTML = item.originalPrice
            ? `<span class="mc-price-orig">₹${item.originalPrice}</span>`
            : '';

        const tagsHTML = item.tags
            .map(t => `<span class="mc-tag">${t}</span>`)
            .join('');

        card.innerHTML = `
      <div class="mc-img">
        ${badgeHTML}
        <div class="mc-rating">⭐ ${item.rating}</div>
        <span class="mc-emoji" aria-hidden="true">${item.emoji}</span>
      </div>
      <div class="mc-body">
        <h3 class="mc-name">${item.name}</h3>
        <p class="mc-desc">${item.desc}</p>
        <div class="mc-tags">${tagsHTML}</div>
        <div class="mc-footer">
          <div>
            <div class="mc-price">₹${item.price}</div>
            ${origPriceHTML}
          </div>
          <div class="mc-action" id="action-${item.id}">
            <!-- Populated by updateCardAction -->
          </div>
        </div>
      </div>
    `;

        menuGrid.appendChild(card);

        // Set correct button state (Add or qty control)
        updateCardAction(item.id);
    });
}

/* ══════════════════════════════════════════════════
   MOBILE SEARCH TOGGLE
══════════════════════════════════════════════════ */
mobileSearchToggle.addEventListener('click', () => {
    const isOpen = mobileSearchBar.classList.toggle('open');
    if (isOpen) {
        mobileSearchInput.focus();
    } else {
        clearSearch();
    }
});

/* ══════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   type: '' | 'success' | 'error'
══════════════════════════════════════════════════ */
function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`.trim();
    toast.textContent = message;
    toastStack.appendChild(toast);

    // Auto-dismiss after 3s
    const timer = setTimeout(() => dismissToast(toast), 3000);

    // Click to dismiss early
    toast.addEventListener('click', () => {
        clearTimeout(timer);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

/* ══════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ══════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
buildCategoryPills();
renderMenu();
updateCartUI();