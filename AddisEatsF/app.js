let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let menuData = [];
let currentSelectedItem = null;
let currentQuantity = 1;

const openAuthBtn = document.querySelector("#open-auth-btn");
const authModal = document.querySelector("#auth-modal");
const closeModal = document.querySelector("#close-modal");
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const toLogin = document.querySelector("#to-login");
const toSignup = document.querySelector("#to-signup");
const toggleBtn = document.getElementById("theme-toggle");

const menuContainer = document.getElementById("menu-items-container");
const itemsCountEl = document.getElementById("items-count");
const searchInput = document.getElementById("menu-search");
const sortSelect = document.getElementById("sort-select");

const dishModal = document.getElementById("dish-modal");
const modalCloseBtn = document.getElementById("modal-close");
const modalCancelBtn = document.getElementById("modal-cancel");
const qtyMinusBtn = document.getElementById("qty-minus");
const qtyPlusBtn = document.getElementById("qty-plus");
const qtyCountEl = document.getElementById("qty-count");
const modalAddCartBtn = document.getElementById("modal-add-cart");

const cartIconWrapper = document.getElementById("cart");
const cartBadge = document.getElementById("cart-badge");
const cartModal = document.getElementById("cart-modal");
const cartModalClose = document.getElementById("cart-modal-close");
const cartItemsContainer = document.getElementById("cart-items-container");
const clearCartBtn = document.getElementById("clear-cart-btn");
const footerCartLink = document.getElementById("footer-cart-link");

const bookTableBtn = document.getElementById("book-table-btn");
const reservationForm = document.getElementById("reservation-form");
const reservationNotes = document.getElementById("reservation-notes");

function toggleAuthView(showLogin) {
    loginForm.classList.toggle("hidden", !showLogin);
    signupForm.classList.toggle("hidden", showLogin);
}

openAuthBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUser) {
        currentUser = null;
        localStorage.removeItem("currentUser");
        updateUserUI();
    } else {
        authModal.classList.remove("hidden");
    }
});

closeModal.addEventListener("click", () => authModal.classList.add("hidden"));
toLogin.addEventListener("click", (e) => { e.preventDefault(); toggleAuthView(true); });
toSignup.addEventListener("click", (e) => { e.preventDefault(); toggleAuthView(false); });

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#signup-name").value;
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;

    if (users.find(u => u.email === email)) {
        alert("Account already exists! Switching to Log In.");
        toggleAuthView(true);
        return;
    }

    const newUser = { name, email, password, cart: [] };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    loginUser(newUser);
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert("Invalid email or password!");
        return;
    }
    loginUser(user);
});

function loginUser(user) {
    currentUser = user;
    if (currentUser.cart) {
        cart = currentUser.cart;
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    saveCart();
    authModal.classList.add("hidden");
    updateUserUI();
}

function updateUserUI() {
    openAuthBtn.textContent = currentUser 
        ? `Logout (${currentUser.name.split(" ")[0]})` 
        : "Sign Up";
}

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

async function fetchMenuData() {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        menuData = data.dishes || [];
        
        renderMenuItems(menuData);
        setupEvents();
        setupModalEvents();

        if (data.about) {
            renderAboutData(data.about);
        }
    } catch (error) {
        console.error("Error loading menu:", error);
        if (menuContainer) {
            menuContainer.innerHTML = `<p style="color: red; text-align: center;">Failed to load menu data. Ensure you are using Live Server.</p>`;
        }
    }
}

function renderMenuItems(items) {
    if (!menuContainer) return;

    if (items.length === 0) {
        menuContainer.innerHTML = `<p style="text-align: center; color: #64748b; padding: 2rem;">No dishes found matching your criteria.</p>`;
        if (itemsCountEl) itemsCountEl.textContent = `0 items available`;
        return;
    }

    menuContainer.innerHTML = items.map(item => `
        <div class="menu-card" data-id="${item.id}">
            <div class="card-main-info">
                <div class="card-title-row">
                    <h3>${item.name}</h3>
                    ${item.localName ? `<span class="amharic-title">${item.localName}</span>` : ''}
                </div>
                
                <div class="card-tags">
                    <span class="badge-tag">${item.categoryLabel}</span>
                    ${item.popular ? `<span class="badge-tag tag-popular">⭐ Popular</span>` : ''}
                    ${item.spiciness && item.spiciness.toLowerCase().includes('spicy') ? `<span class="badge-tag tag-spicy">🌶️ ${item.spiciness}</span>` : ''}
                    ${item.dietary ? `<span class="badge-tag">${item.dietary}</span>` : ''}
                </div>

                <p class="card-description">${item.description}</p>

                <div class="card-meta">
                    <span>🕒 ${item.prepTime}</span>
                    ${item.ingredients ? `<span>•</span><span>${item.ingredients.length} fresh ingredients</span>` : ''}
                </div>
            </div>

            <div class="card-action-side">
                <div class="card-price-box">
                    <span class="currency-label">ETB</span>
                    <span class="price-value">${Number(item.price).toFixed(2)}</span>
                </div>
                <button class="btn-view-details">View Details &rsaquo;</button>
            </div>
        </div>
    `).join('');

    if (itemsCountEl) itemsCountEl.textContent = `${items.length} items available`;
}

function renderAboutData(about) {
    const aboutContainer = document.getElementById("about-content");
    if (!aboutContainer) return;

    aboutContainer.innerHTML = `
        <span class="badge-tag tag-popular">${about.badge}</span>
        <h2>${about.title}</h2>
        ${about.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
    `;
}

function openDishModal(dishId) {
    const dish = menuData.find(item => item.id === dishId);
    if (!dish) return;

    currentSelectedItem = dish;
    currentQuantity = 1;

    document.getElementById('modal-top-title').textContent = dish.name;
    document.getElementById('modal-top-category').textContent = dish.categoryLabel;
    document.getElementById('modal-main-title').textContent = dish.name;
    document.getElementById('modal-amharic-title').textContent = dish.localName || '';
    document.getElementById('modal-price').textContent = `${Number(dish.price).toFixed(2)} ETB`;
    document.getElementById('modal-prep-time').textContent = `🕒 ${dish.prepTime}`;
    document.getElementById('modal-description').textContent = dish.description;

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = `
        <span class="badge-tag">${dish.categoryLabel}</span>
        ${dish.popular ? `<span class="badge-tag tag-popular">⭐ Popular Favorite</span>` : ''}
        ${dish.dietary ? `<span class="badge-tag">${dish.dietary}</span>` : ''}
        ${dish.spiciness ? `<span class="badge-tag tag-spicy">🌶️ ${dish.spiciness}</span>` : ''}
    `;

    const ingredientsContainer = document.getElementById('modal-ingredients');
    ingredientsContainer.innerHTML = (dish.ingredients && dish.ingredients.length > 0)
        ? dish.ingredients.map(ing => `<span class="ing-pill">${ing}</span>`).join('')
        : `<span style="color:#64748b;">No ingredients listed</span>`;

    updateQuantityUI();
    dishModal.classList.remove('hidden');
}

function closeDishModal() {
    dishModal.classList.add('hidden');
}

function updateQuantityUI() {
    if (!currentSelectedItem) return;

    qtyCountEl.textContent = currentQuantity;
    document.getElementById('cart-btn-qty').textContent = currentQuantity;
    
    const totalPrice = (currentSelectedItem.price * currentQuantity).toFixed(2);
    document.getElementById('cart-btn-price').textContent = `${totalPrice} ETB`;
}

function setupModalEvents() {
    if (menuContainer) {
        menuContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-view-details');
            if (btn) {
                const card = btn.closest('.menu-card');
                openDishModal(card.getAttribute('data-id'));
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDishModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeDishModal);
    if (dishModal) {
        dishModal.addEventListener('click', (e) => {
            if (e.target === dishModal) closeDishModal();
        });
    }

    if (qtyMinusBtn) {
        qtyMinusBtn.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                updateQuantityUI();
            }
        });
    }

    if (qtyPlusBtn) {
        qtyPlusBtn.addEventListener('click', () => {
            currentQuantity++;
            updateQuantityUI();
        });
    }

    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', addToCart);
    }
}

function setupEvents() {
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    const categoryBtns = document.querySelectorAll('.pill-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    const tagBtns = document.querySelectorAll('.tag-filter-btn');
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            applyFilters();
        });
    });
}

function applyFilters() {
    let filtered = [...menuData];

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(query)))
        );
    }

    const activeCategoryBtn = document.querySelector('.pill-btn.active');
    if (activeCategoryBtn) {
        const category = activeCategoryBtn.getAttribute('data-category');
        if (category !== 'all') {
            filtered = filtered.filter(item => item.categoryLabel.toLowerCase() === category.toLowerCase());
        }
    }

    const activeTags = Array.from(document.querySelectorAll('.tag-filter-btn.active'))
                            .map(btn => btn.getAttribute('data-tag'));

    if (activeTags.length > 0) {
        filtered = filtered.filter(item => {
            return activeTags.every(tag => {
                if (tag === 'Popular') return item.popular;
                if (tag === 'Spicy') return item.spiciness && item.spiciness.toLowerCase().includes('spicy');
                if (tag === 'Vegan / Fasting') return item.dietary && item.dietary.toLowerCase().includes('vegan');
                return true;
            });
        });
    }

    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === 'low-high') filtered.sort((a, b) => a.price - b.price);
        else if (sortValue === 'high-low') filtered.sort((a, b) => b.price - a.price);
    }

    renderMenuItems(filtered);
}

function addToCart() {
    if (!currentSelectedItem) return;

    const existingIndex = cart.findIndex(item => item.id === currentSelectedItem.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += currentQuantity;
    } else {
        cart.push({
            id: currentSelectedItem.id,
            name: currentSelectedItem.name,
            price: currentSelectedItem.price,
            quantity: currentQuantity
        });
    }

    saveCart();
    closeDishModal();
    renderCartModal();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (currentUser) {
        currentUser.cart = cart;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        users = users.map(u => u.email === currentUser.email ? currentUser : u);
        localStorage.setItem("users", JSON.stringify(users));
    }
    
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = totalItems;
}

function renderCartModal() {
    if (!cartItemsContainer) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = subtotal * 0.05;
    const totalBill = subtotal + serviceFee;

    const itemCountSubtitle = document.getElementById('cart-item-count-subtitle');
    const summaryPortionsBadge = document.getElementById('summary-portions-badge');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryService = document.getElementById('summary-service');
    const summaryTotal = document.getElementById('summary-total');

    if (itemCountSubtitle) itemCountSubtitle.textContent = `${cart.length} items selected`;
    if (summaryPortionsBadge) summaryPortionsBadge.textContent = `${totalCount} Portions`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; padding: 1.5rem; color: #64748b;">Your cart is empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-card" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price-unit">${Number(item.price).toFixed(2)} ETB each</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button type="button" class="qty-btn btn-qty-minus">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="qty-btn btn-qty-plus">+</button>
                    </div>
                    <strong class="price-value">${(item.price * item.quantity).toFixed(2)} ETB</strong>
                    <button type="button" class="btn-remove-item">&times;</button>
                </div>
            </div>
        `).join('');
    }

    if (summarySubtotal) summarySubtotal.textContent = `${subtotal.toFixed(2)} ETB`;
    if (summaryService) summaryService.textContent = `${serviceFee.toFixed(2)} ETB`;
    if (summaryTotal) summaryTotal.textContent = `${totalBill.toFixed(2)} ETB`;
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.cart-item-card');
        if (!card) return;
        const dishId = card.getAttribute('data-id');

        if (e.target.classList.contains('btn-qty-minus')) {
            window.changeCartItemQty(dishId, -1);
        } else if (e.target.classList.contains('btn-qty-plus')) {
            window.changeCartItemQty(dishId, 1);
        } else if (e.target.classList.contains('btn-remove-item')) {
            window.removeCartItem(dishId);
        }
    });
}

window.changeCartItemQty = function(dishId, amount) {
    const item = cart.find(i => i.id === dishId);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== dishId);
    }
    saveCart();
    renderCartModal();
};

window.removeCartItem = function(dishId) {
    cart = cart.filter(i => i.id !== dishId);
    saveCart();
    renderCartModal();
};

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCartModal();
    });
}

if (cartIconWrapper) {
    cartIconWrapper.addEventListener('click', () => {
        renderCartModal();
        cartModal.classList.remove('hidden');
    });
}

if (footerCartLink) {
    footerCartLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCartModal();
        cartModal.classList.remove('hidden');
    });
}

if (cartModalClose) {
    cartModalClose.addEventListener('click', () => cartModal.classList.add('hidden'));
}

if (bookTableBtn) {
    bookTableBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');

        if (cart.length > 0) {
            const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalBill = (subtotal * 1.05).toFixed(2);

            reservationNotes.value = `Linked Order Details:\nItems: ${itemsList}\nTotal: ${totalBill} ETB`;
        } else {
            reservationNotes.value = '';
        }

        const reservationSection = document.getElementById('reservation');
        if (reservationSection) {
            reservationSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('res-name').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;

        alert(`🎉 Reserved Successfully!\n\nThank you, ${name}! Your table has been booked for ${date} at ${time}.\nWe look forward to serving you!`);

        reservationForm.reset();
        cart = [];
        saveCart();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateUserUI();
    updateCartBadge();
    fetchMenuData();
});