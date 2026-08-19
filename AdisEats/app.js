/**
 * Addis Eats - Modern Restaurant Application
 * Handles menu rendering, search & filtering, details popups, cart management,
 * dynamic guest split calculation, table reservations, profile booking storage, and theme switching.
 */

// Fallback menu dataset (guarantees instant zero-lag load even on file:// protocol)
const DEFAULT_MENU_DATA = [
  {
    id: "doro-wat",
    name: "Special Doro Wat",
    localName: "የዶሮ ወጥ",
    category: "stews",
    categoryLabel: "Traditional Stews",
    price: 350.00,
    prepTime: "25 mins",
    spiciness: "Spicy",
    dietary: "Non-Vegetarian",
    popular: true,
    description: "Slow-simmered tender chicken drumstick stewed in rich, aromatic berbere sauce with caramelized onions, garlic, and clarified spiced butter, served with hard-boiled egg and warm injera.",
    ingredients: [
      "Organic Chicken Drumsticks",
      "Traditional Berbere Spice Blend",
      "Slow-Caramelized Red Onions",
      "Niter Kibbeh (Clarified Spiced Butter)",
      "Hard-Boiled Egg",
      "Fresh Teff Injera"
    ],
    tags: ["Popular", "Traditional", "Spicy"]
  },
  {
    id: "special-kitfo",
    name: "Special Kitfo",
    localName: "ልዩ ክትፎ",
    category: "beef",
    categoryLabel: "Tibs & Beef",
    price: 420.00,
    prepTime: "15 mins",
    spiciness: "Medium Spicy",
    dietary: "Non-Vegetarian",
    popular: true,
    description: "Prime minced lean beef seasoned with fiery mitmita chili blend and warm clarified spiced butter (niter kibbeh), served with house-made ayib cheese and gomen collard greens.",
    ingredients: [
      "Prime Lean Ground Beef",
      "Authentic Mitmita Chili",
      "Warm Niter Kibbeh (Herbal Butter)",
      "House-Made Ayib (Cottage Cheese)",
      "Steamed Gomen (Collard Greens)",
      "Fresh Injera or Kocho"
    ],
    tags: ["Popular", "Chef Choice", "High Protein"]
  },
  {
    id: "shiro-wat",
    name: "Special Shiro Wat",
    localName: "ልዩ ሽሮ ወጥ",
    category: "vegetarian",
    categoryLabel: "Vegetarian & Fasting",
    price: 220.00,
    prepTime: "18 mins",
    spiciness: "Mild Spicy",
    dietary: "Vegan / Fasting",
    popular: true,
    description: "Silky, velvety ground chickpea and split pea flour stew gently simmered in a clay pot with garlic, ginger, and berbere herbs.",
    ingredients: [
      "Spiced Shiro Chickpea Powder",
      "Red Onions & Minced Garlic",
      "Fresh Tomato Reduction",
      "Pure Olive / Sunflower Oil",
      "Sliced Green Jalapeños",
      "Warm Teff Injera"
    ],
    tags: ["Vegan", "Fasting Friendly", "Popular"]
  },
  {
    id: "beef-shekla-tibs",
    name: "Beef Shekla Tibs",
    localName: "የሸክላ ጥብስ",
    category: "beef",
    categoryLabel: "Tibs & Beef",
    price: 380.00,
    prepTime: "20 mins",
    spiciness: "Mild",
    dietary: "Non-Vegetarian",
    popular: true,
    description: "Cubed tender beef tenderloin pan-seared over high heat with fragrant rosemary, sweet red onions, garlic, and fresh green chili peppers, served sizzling in a clay shekla.",
    ingredients: [
      "Beef Tenderloin Cubes",
      "Fresh Wild Rosemary",
      "Red Onions & Sliced Garlic",
      "Ethiopian Jalapeños",
      "Niter Kibbeh Clarified Butter",
      "Warm Teff Injera"
    ],
    tags: ["Sizzling", "Popular", "Gluten-Free Teff"]
  },
  {
    id: "yetsom-beyaynetu",
    name: "Yetsom Beyaynetu",
    localName: "የጾም በያይነቱ",
    category: "vegetarian",
    categoryLabel: "Vegetarian & Fasting",
    price: 250.00,
    prepTime: "15 mins",
    spiciness: "Variety",
    dietary: "Vegan / Fasting",
    popular: true,
    description: "The quintessential Ethiopian vegan feast: a colorful platter of spicy red lentils (Misir), turmeric split peas (Kik Alicha), collard greens (Gomen), cabbage with carrots (Tikil Gomen), and beet salad.",
    ingredients: [
      "Misir Wat (Spiced Red Lentils)",
      "Kik Alicha (Yellow Split Peas)",
      "Gomen (Stewed Collard Greens)",
      "Tikil Gomen (Cabbage & Carrots)",
      "Azifa (Green Lentil Salad)",
      "Fresh Injera Platter"
    ],
    tags: ["100% Vegan", "Platter", "Popular"]
  },
  {
    id: "special-chechebsa",
    name: "Special Chechebsa (Kita Firfir)",
    localName: "ልዩ ጨጨብሳ",
    category: "breakfast",
    categoryLabel: "Breakfast & Specials",
    price: 180.00,
    prepTime: "12 mins",
    spiciness: "Mild",
    dietary: "Vegetarian",
    popular: true,
    description: "Torn homemade flatbread (kita) lightly tossed in warm clarified spiced butter and berbere, drizzled with pure highland honey and served with organic yogurt or ayib.",
    ingredients: [
      "Freshly Griddled Kita Flatbread",
      "Highland Niter Kibbeh",
      "Mild Berbere Seasoning",
      "Pure Ethiopian Wild Honey",
      "Fresh Ayib / Natural Yogurt"
    ],
    tags: ["Breakfast", "Sweet & Savory", "Popular"]
  },
  {
    id: "lamb-tibs",
    name: "Awaze Lamb Tibs",
    localName: "የበግ አዋዜ ጥብስ",
    category: "beef",
    categoryLabel: "Tibs & Beef",
    price: 400.00,
    prepTime: "20 mins",
    spiciness: "Spicy",
    dietary: "Non-Vegetarian",
    popular: false,
    description: "Succulent highland lamb morsels sautéed with fiery Awaze paste, sweet onions, vine tomatoes, and rosemary in seasoned herbal butter.",
    ingredients: [
      "Highland Lamb Chops & Meat",
      "Authentic Awaze Chili Paste",
      "Sweet Sliced Onions",
      "Fresh Rosemary",
      "Clarified Herb Butter",
      "Injera"
    ],
    tags: ["Spicy", "Chef Choice"]
  },
  {
    id: "gomen-besiga",
    name: "Gomen Besiga",
    localName: "ጎመን በስጋ",
    category: "stews",
    categoryLabel: "Traditional Stews",
    price: 310.00,
    prepTime: "22 mins",
    spiciness: "Mild",
    dietary: "Non-Vegetarian",
    popular: false,
    description: "Tender cut beef pieces slow-braised together with farm-fresh collard greens, garlic, ginger, and cardamom-infused clarified butter.",
    ingredients: [
      "Braised Beef Cuts",
      "Organic Collard Greens",
      "Fresh Crushed Ginger & Garlic",
      "Niter Kibbeh Spiced Butter",
      "Cardamom & White Pepper",
      "Injera"
    ],
    tags: ["Comfort Food", "Traditional"]
  },
  {
    id: "misir-wat",
    name: "Misir Wat (Spicy Red Lentils)",
    localName: "ምስር ወጥ",
    category: "vegetarian",
    categoryLabel: "Vegetarian & Fasting",
    price: 190.00,
    prepTime: "15 mins",
    spiciness: "Medium Spicy",
    dietary: "Vegan / Fasting",
    popular: false,
    description: "Nutritious red split lentils simmered slowly in rich berbere sauce with caramelized onions, garlic, and cumin.",
    ingredients: [
      "Organic Red Split Lentils",
      "Berbere Spice Mix",
      "Minced Shallots & Garlic",
      "Cold-Pressed Vegetable Oil",
      "Injera"
    ],
    tags: ["Vegan", "High Fiber"]
  },
  {
    id: "traditional-buna",
    name: "Traditional Buna Coffee Ceremony",
    localName: "የባህል ቡና ቁርስ",
    category: "drinks",
    categoryLabel: "Drinks & Desserts",
    price: 120.00,
    prepTime: "15 mins",
    spiciness: "None",
    dietary: "Vegan",
    popular: true,
    description: "Authentic ceremonial Ethiopian coffee roasted, freshly ground, and brewed in a clay Jebena pot. Served with frankincense aroma, freshly popped corn, and rue herbs.",
    "ingredients": [
      "Organic Yirgacheffe / Sidama Green Coffee Beans",
      "Spring Water",
      "Fresh Popcorn (Fendisha)",
      "Traditional Tena Adam (Rue Herb)",
      "Aromatic Frankincense"
    ],
    tags: ["Beverage", "Cultural Experience", "Popular"]
  },
  {
    id: "house-tej",
    name: "Artisanal Honey Wine (Tej)",
    localName: "የማር ጠጅ",
    category: "drinks",
    categoryLabel: "Drinks & Desserts",
    price: 150.00,
    prepTime: "5 mins",
    spiciness: "None",
    dietary: "Vegetarian",
    popular: false,
    description: "Traditional Ethiopian honey wine fermented with wild forest honey and Gesho (buckthorn) leaves. Served in authentic Berele glass flasks.",
    ingredients: [
      "Pure Highland Forest Honey",
      "Gesho Leaves & Stems",
      "Pure Filtered Water"
    ],
    tags: ["Beverage", "Traditional"]
  }
];

// Application State
const state = {
  menuItems: [],
  selectedCategory: "all",
  searchQuery: "",
  dietaryFilter: null,
  sortBy: "featured",
  activeModalItem: null,
  itemModalQty: 1,
  cart: [],
  guestCount: 2,
  reservations: [],
  theme: "light"
};

// Storage Keys
const STORAGE_KEYS = {
  CART: "addis_eats_cart",
  GUESTS: "addis_eats_guest_count",
  RESERVATIONS: "addis_eats_reservations",
  THEME: "addis_eats_theme",
  USER: "addis_eats_user"
};

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  loadSavedState();
  await loadMenuData();
  setupEventListeners();
  renderMenu();
  updateCartBadge();
  updateProfileBadge();
  setDefaultBookingDates();
});

function loadSavedState() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) state.cart = JSON.parse(savedCart);

    const savedGuests = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (savedGuests) state.guestCount = parseInt(savedGuests, 10) || 2;

    const savedReservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (savedReservations) {
      state.reservations = JSON.parse(savedReservations);
    } else {
      // Provide an initial sample reservation for demonstration
      state.reservations = [
        {
          id: "AE-2026-88",
          name: "Dawit Yohannes",
          phone: "0912345678",
          guests: 4,
          table: "Table #1 - Traditional Mesob Dining",
          date: "2026-08-20",
          time: "19:30",
          notes: "Traditional Mesob setting requested",
          status: "Confirmed",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(state.reservations));
    }
  } catch (err) {
    console.warn("Storage loading error:", err);
  }
}

async function loadMenuData() {
  try {
    const response = await fetch("data.json");
    if (response.ok) {
      state.menuItems = await response.json();
    } else {
      state.menuItems = DEFAULT_MENU_DATA;
    }
  } catch (error) {
    console.info("Using embedded menu data dataset:", error.message);
    state.menuItems = DEFAULT_MENU_DATA;
  }

  // Update dish count metric
  const countEl = document.getElementById("statsDishCount");
  if (countEl) countEl.textContent = `${state.menuItems.length}+`;
}

function setDefaultBookingDates() {
  const dateInput = document.getElementById("resDate");
  const timeInput = document.getElementById("resTime");
  if (dateInput) {
    const today = new Date();
    dateInput.min = today.toISOString().split("T")[0];
    dateInput.value = today.toISOString().split("T")[0];
  }
  if (timeInput && !timeInput.value) {
    timeInput.value = "19:00";
  }
}

/* ==========================================================================
   Theme Management (Light / Dark)
   ========================================================================== */

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme === "dark") {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    if (theme === "dark") {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      toggleBtn.setAttribute("title", "Switch to Light Mode");
    } else {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      toggleBtn.setAttribute("title", "Switch to Dark Mode");
    }
  }
}

function toggleTheme() {
  const newTheme = state.theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

/* ==========================================================================
   Menu Filtering, Searching, & Rendering
   ========================================================================== */

function getFilteredMenu() {
  let list = [...state.menuItems];

  // Category filter
  if (state.selectedCategory !== "all") {
    list = list.filter(item => item.category === state.selectedCategory);
  }

  // Dietary chip filter
  if (state.dietaryFilter === "popular") {
    list = list.filter(item => item.popular);
  } else if (state.dietaryFilter === "vegan") {
    list = list.filter(item => (item.dietary || "").toLowerCase().includes("vegan"));
  } else if (state.dietaryFilter === "spicy") {
    list = list.filter(item => (item.spiciness || "").toLowerCase().includes("spicy"));
  }

  // Search query filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(item => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchLocal = (item.localName || "").toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIngredients = (item.ingredients || []).some(ing => ing.toLowerCase().includes(q));
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      return matchName || matchLocal || matchDesc || matchIngredients || matchTags;
    });
  }

  // Sorting
  if (state.sortBy === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderMenu() {
  const container = document.getElementById("menuListContainer");
  const countBadge = document.getElementById("displayedItemsCount");
  if (!container) return;

  const items = getFilteredMenu();
  if (countBadge) countBadge.textContent = items.length;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="empty-state-title">No matching dishes found</div>
        <div class="empty-state-desc">Try changing your search term or filter options to explore our traditional cuisine.</div>
        <button type="button" class="btn-secondary" id="resetFiltersBtn">Reset All Filters</button>
      </div>
    `;

    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.selectedCategory = "all";
        state.dietaryFilter = null;
        state.searchQuery = "";
        state.sortBy = "featured";

        const searchInput = document.getElementById("menuSearchInput");
        if (searchInput) searchInput.value = "";
        const sortSelect = document.getElementById("menuSortSelect");
        if (sortSelect) sortSelect.value = "featured";

        updateFilterTabButtons();
        updateChipButtons();
        renderMenu();
      });
    }
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="menu-list-item" data-item-id="${item.id}" tabindex="0" role="button" aria-label="View details for ${item.name}">
      <div class="item-main-info">
        <div class="item-title-row">
          <h3 class="item-name-primary">${escapeHtml(item.name)}</h3>
          ${item.localName ? `<span class="item-name-ethiopic">${escapeHtml(item.localName)}</span>` : ""}
        </div>

        <div class="item-badges-list">
          <span class="badge badge-neutral">${escapeHtml(item.categoryLabel || item.category)}</span>
          ${item.popular ? `<span class="badge badge-popular">⭐ Popular</span>` : ""}
          ${(item.dietary || "").toLowerCase().includes("vegan") ? `<span class="badge badge-vegan">🌱 Vegan</span>` : ""}
          ${(item.spiciness || "").toLowerCase().includes("spicy") ? `<span class="badge badge-spicy">🌶️ ${escapeHtml(item.spiciness)}</span>` : ""}
        </div>

        <p class="item-description-short">${escapeHtml(item.description)}</p>

        <div class="item-meta-line">
          <span class="item-meta-point">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${escapeHtml(item.prepTime || "15 mins")}
          </span>
          <span>•</span>
          <span>${item.ingredients ? `${item.ingredients.length} fresh ingredients` : "Authentic recipe"}</span>
        </div>
      </div>

      <div class="item-action-col">
        <div class="item-price-tag">
          <div class="price-currency">ETB</div>
          <div class="price-amount">${item.price.toFixed(2)}</div>
        </div>
        <button type="button" class="btn-view-details" data-item-id="${item.id}" aria-label="View details of ${item.name}">
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </article>
  `).join("");

  // Attach click events to menu items and buttons
  container.querySelectorAll(".menu-list-item").forEach(card => {
    card.addEventListener("click", (e) => {
      const itemId = card.getAttribute("data-item-id");
      openItemDetailsModal(itemId);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const itemId = card.getAttribute("data-item-id");
        openItemDetailsModal(itemId);
      }
    });
  });
}

function updateFilterTabButtons() {
  document.querySelectorAll(".category-tab-btn").forEach(btn => {
    const cat = btn.getAttribute("data-category");
    btn.classList.toggle("active", cat === state.selectedCategory);
  });
}

function updateChipButtons() {
  document.querySelectorAll(".chip-btn").forEach(btn => {
    const filter = btn.getAttribute("data-filter");
    btn.classList.toggle("active", filter === state.dietaryFilter);
  });
}

/* ==========================================================================
   Food Item Details Modal
   ========================================================================== */

function openItemDetailsModal(itemId) {
  const item = state.menuItems.find(i => i.id === itemId);
  if (!item) return;

  state.activeModalItem = item;
  state.itemModalQty = 1;

  document.getElementById("modalItemTitle").textContent = item.name;
  document.getElementById("modalItemCategory").textContent = item.categoryLabel || item.category.toUpperCase();
  document.getElementById("modalPopupName").textContent = item.name;
  document.getElementById("modalPopupEthiopic").textContent = item.localName || "";
  document.getElementById("modalPopupPrice").textContent = `${item.price.toFixed(2)} ETB`;
  document.getElementById("modalPopupDescription").textContent = item.description;
  document.getElementById("itemQtyDisplay").textContent = "1";

  // Badges
  const badgesContainer = document.getElementById("modalPopupBadges");
  badgesContainer.innerHTML = `
    <span class="badge badge-neutral">${escapeHtml(item.categoryLabel || item.category)}</span>
    ${item.popular ? `<span class="badge badge-popular">⭐ Popular Favorite</span>` : ""}
    ${item.dietary ? `<span class="badge badge-vegan">${escapeHtml(item.dietary)}</span>` : ""}
    ${item.spiciness ? `<span class="badge badge-spicy">🌶️ ${escapeHtml(item.spiciness)}</span>` : ""}
    <span class="badge badge-neutral">⏱️ ${escapeHtml(item.prepTime || "15 mins")}</span>
  `;

  // Ingredients tags
  const ingredientsContainer = document.getElementById("modalPopupIngredients");
  if (item.ingredients && item.ingredients.length > 0) {
    ingredientsContainer.innerHTML = item.ingredients.map(ing => `
      <span class="ingredient-pill">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ${escapeHtml(ing)}
      </span>
    `).join("");
  } else {
    ingredientsContainer.innerHTML = `<span class="form-hint">Fresh local ingredients prepared daily.</span>`;
  }

  updateItemModalAddButton();
  openModal("itemDetailsModal");
}

function updateItemModalAddButton() {
  if (!state.activeModalItem) return;
  const totalPrice = (state.activeModalItem.price * state.itemModalQty).toFixed(2);
  const btnText = document.getElementById("addToCartBtnText");
  if (btnText) {
    btnText.textContent = `Add ${state.itemModalQty} to Cart • ${totalPrice} ETB`;
  }
}

/* ==========================================================================
   Cart Management & Guest Split Calculator
   ========================================================================== */

function addToCart(item, quantity = 1) {
  const existing = state.cart.find(c => c.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: item.id,
      name: item.name,
      localName: item.localName || "",
      category: item.category,
      price: item.price,
      quantity: quantity
    });
  }

  saveCart();
  updateCartBadge(true);
  showToast(`Added ${quantity}x ${item.name} to cart`);
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
  } catch (err) {
    console.warn("Error saving cart:", err);
  }
}

function updateCartBadge(pulse = false) {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalCount;

  if (pulse) {
    badge.classList.remove("pulse");
    void badge.offsetWidth; // trigger reflow
    badge.classList.add("pulse");
  }
}

function renderCart() {
  const container = document.getElementById("cartItemsList");
  const subtitle = document.getElementById("cartItemsSubtitle");
  if (!container) return;

  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (subtitle) {
    subtitle.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? "item" : "items"} selected`;
  }

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="padding: 2rem 1rem;">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <div class="empty-state-title">Your cart is empty</div>
        <div class="empty-state-desc">Select handcrafted dishes from our menu to begin your culinary order.</div>
      </div>
    `;
  } else {
    container.innerHTML = state.cart.map(item => `
      <div class="cart-item-row" data-cart-id="${item.id}">
        <div class="cart-item-left">
          <div class="cart-item-title">${escapeHtml(item.name)}</div>
          <div class="cart-item-unit-price">${item.price.toFixed(2)} ETB each</div>
        </div>

        <div class="cart-item-right">
          <div class="stepper-control" style="padding: 0.15rem;">
            <button type="button" class="stepper-btn cart-qty-dec" data-id="${item.id}" aria-label="Decrease quantity" style="width: 1.6rem; height: 1.6rem; font-size: 0.85rem;">-</button>
            <span class="stepper-number" style="min-width: 1.5rem; font-size: 0.9rem;">${item.quantity}</span>
            <button type="button" class="stepper-btn cart-qty-inc" data-id="${item.id}" aria-label="Increase quantity" style="width: 1.6rem; height: 1.6rem; font-size: 0.85rem;">+</button>
          </div>

          <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)} ETB</div>

          <button type="button" class="cart-item-delete cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join("");

    // Attach quantity and removal events
    container.querySelectorAll(".cart-qty-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const found = state.cart.find(c => c.id === id);
        if (found) {
          found.quantity += 1;
          saveCart();
          updateCartBadge();
          renderCart();
        }
      });
    });

    container.querySelectorAll(".cart-qty-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const found = state.cart.find(c => c.id === id);
        if (found) {
          if (found.quantity > 1) {
            found.quantity -= 1;
          } else {
            state.cart = state.cart.filter(c => c.id !== id);
          }
          saveCart();
          updateCartBadge();
          renderCart();
        }
      });
    });

    container.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        state.cart = state.cart.filter(c => c.id !== id);
        saveCart();
        updateCartBadge();
        renderCart();
        showToast("Item removed from cart");
      });
    });
  }

  // Update portion-based bill calculations
  updateBillCalculations();
}

function updateBillCalculations() {
  const totalPortions = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const service = subtotal > 0 ? subtotal * 0.05 : 0;
  const total = subtotal + service;

  const portionsPill = document.getElementById("cartTotalPortionsPill");
  const subtotalEl = document.getElementById("cartSubtotal");
  const serviceEl = document.getElementById("cartService");
  const totalEl = document.getElementById("cartTotal");

  if (portionsPill) {
    portionsPill.textContent = `${totalPortions} ${totalPortions === 1 ? "Portion" : "Portions"}`;
  }
  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} ETB`;
  if (serviceEl) serviceEl.textContent = `${service.toFixed(2)} ETB`;
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} ETB`;
}

/* ==========================================================================
   Table Reservations & Profile Data
   ========================================================================== */

function tryOpenReservation() {
  if (state.cart.length === 0) {
    showToast("Please select your dishes from the menu first!", "warning");
    const menuEl = document.getElementById("menu");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth", block: "start" });
      const menuCard = menuEl.querySelector(".master-menu-card");
      if (menuCard) {
        menuCard.classList.remove("highlight-pulse");
        void menuCard.offsetWidth; // trigger reflow
        menuCard.classList.add("highlight-pulse");
      }
    }
    const searchInput = document.getElementById("menuSearchInput");
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 600);
    }
    return;
  }
  openModal("reservationModal");
}

function handleReservationSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("resName");
  const phoneInput = document.getElementById("resPhone");
  const guestsInput = document.getElementById("resGuests");
  const tableInput = document.getElementById("resTable");
  const dateInput = document.getElementById("resDate");
  const timeInput = document.getElementById("resTime");
  const notesInput = document.getElementById("resNotes");

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const guests = parseInt(guestsInput.value, 10) || 2;
  const table = tableInput.value;
  const date = dateInput.value;
  const time = timeInput.value;
  const notes = notesInput ? notesInput.value.trim() : "";

  if (!name || !phone || !date || !time) {
    showToast("Please fill in all required fields", "warning");
    return;
  }

  // Create booking object
  const bookingId = `AE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReservation = {
    id: bookingId,
    name,
    phone,
    guests,
    table,
    date,
    time,
    notes,
    status: "Confirmed",
    preOrderedItems: [...state.cart],
    createdAt: new Date().toISOString()
  };

  // Prepend to reservations list
  state.reservations.unshift(newReservation);
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(state.reservations));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name, phone }));
  } catch (err) {
    console.warn("Storage error:", err);
  }

  updateProfileBadge();

  // Populate Success Modal
  document.getElementById("successBookingId").textContent = `#${bookingId}`;
  document.getElementById("successName").textContent = name;
  document.getElementById("successTable").textContent = table.split("-")[0].trim() || table;
  document.getElementById("successSchedule").textContent = `${formatDate(date)} at ${formatTime(time)}`;
  document.getElementById("successGuests").textContent = `${guests} ${guests === 1 ? "Guest" : "Guests"}`;

  // Close reservation modal, open success modal
  closeModal("reservationModal");
  openModal("successModal");
  showToast("Reservation successfully booked!");
}

function updateProfileBadge() {
  const badge = document.getElementById("profileBadge");
  const countEl = document.getElementById("profileResCount");
  if (!badge) return;

  const count = state.reservations.length;
  if (countEl) countEl.textContent = count;

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function renderProfile() {
  const listContainer = document.getElementById("profileReservationsList");
  const displayName = document.getElementById("profileDisplayName");
  const displayPhone = document.getElementById("profileDisplayPhone");
  const avatarText = document.getElementById("profileAvatarText");

  // Retrieve user info from storage or latest reservation
  let user = { name: "Dawit Yohannes", phone: "+251 91 234 5678" };
  if (state.reservations.length > 0) {
    user.name = state.reservations[0].name;
    user.phone = state.reservations[0].phone;
  }

  if (displayName) displayName.textContent = user.name;
  if (displayPhone) displayPhone.textContent = `${user.phone} • Gourmet Dining Member`;
  if (avatarText) {
    const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    avatarText.textContent = initials || "AE";
  }

  if (!listContainer) return;

  if (state.reservations.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state-card" style="padding: 2rem 1rem;">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="empty-state-title">No Booked Reservations</div>
        <div class="empty-state-desc">You don't have any saved table bookings. Choose dishes from our menu to reserve a table!</div>
        <button type="button" class="btn-primary" id="profileEmptyBookBtn" style="margin-top: 0.75rem;">Explore Menu &amp; Book</button>
      </div>
    `;

    const emptyBookBtn = document.getElementById("profileEmptyBookBtn");
    if (emptyBookBtn) {
      emptyBookBtn.addEventListener("click", () => {
        closeModal("profileModal");
        tryOpenReservation();
      });
    }
    return;
  }

  listContainer.innerHTML = state.reservations.map(res => `
    <div class="reservation-card-item" data-res-id="${res.id}">
      <div class="res-card-top">
        <span class="res-code">#${res.id}</span>
        <span class="res-status-badge">${escapeHtml(res.status || "Confirmed")}</span>
      </div>

      <div class="res-details-grid">
        <div class="res-grid-item">
          <span class="res-label">Table Area</span>
          <span class="res-val">${escapeHtml(res.table)}</span>
        </div>
        <div class="res-grid-item">
          <span class="res-label">Date &amp; Arrival</span>
          <span class="res-val">${formatDate(res.date)} at ${formatTime(res.time)}</span>
        </div>
        <div class="res-grid-item">
          <span class="res-label">Party Size</span>
          <span class="res-val">${res.guests} Guests</span>
        </div>
        <div class="res-grid-item">
          <span class="res-label">Contact</span>
          <span class="res-val">${escapeHtml(res.phone)}</span>
        </div>
      </div>

      ${res.notes ? `
        <div style="font-size: 0.8rem; color: var(--text-muted); padding-top: 0.25rem;">
          <em>Note: "${escapeHtml(res.notes)}"</em>
        </div>
      ` : ""}

      ${res.preOrderedItems && res.preOrderedItems.length > 0 ? `
        <div style="font-size: 0.8rem; color: var(--accent-primary); padding-top: 0.25rem; font-weight: 600;">
          Order: ${res.preOrderedItems.map(i => `${i.quantity}x ${i.name}`).join(", ")}
        </div>
      ` : ""}

      <div class="res-card-actions">
        <button type="button" class="btn-cancel-res" data-res-id="${res.id}" aria-label="Delete booking ${res.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Delete Booking</span>
        </button>
      </div>
    </div>
  `).join("");

  // Attach delete events
  listContainer.querySelectorAll(".btn-cancel-res").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-res-id");
      state.reservations = state.reservations.filter(r => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(state.reservations));
      } catch (err) {
        console.warn("Storage error:", err);
      }
      updateProfileBadge();
      renderProfile();
      showToast(`Booking #${id} deleted from profile`);
    });
  });
}

/* ==========================================================================
   Modal Framework
   ========================================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    const anyActive = document.querySelectorAll(".modal-backdrop.active").length > 0;
    if (!anyActive) {
      document.body.style.overflow = "";
    }
  }
}

/* ==========================================================================
   Event Listeners Wire-Up
   ========================================================================== */

function setupEventListeners() {
  // Theme Toggle Button
  const themeToggle = document.getElementById("themeToggleBtn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Header & Hero Reservation Buttons (Require Menu Selection First)
  const headerBookBtn = document.getElementById("headerBookBtn");
  if (headerBookBtn) {
    headerBookBtn.addEventListener("click", tryOpenReservation);
  }

  const heroBookBtn = document.getElementById("heroBookBtn");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", tryOpenReservation);
  }

  const footerBookLink = document.getElementById("footerBookLink");
  if (footerBookLink) {
    footerBookLink.addEventListener("click", tryOpenReservation);
  }

  // Cart Open Buttons
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      renderCart();
      openModal("cartModal");
    });
  }

  const footerCartLink = document.getElementById("footerCartLink");
  if (footerCartLink) {
    footerCartLink.addEventListener("click", () => {
      renderCart();
      openModal("cartModal");
    });
  }

  // Profile Open Buttons
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      renderProfile();
      openModal("profileModal");
    });
  }

  const footerProfileLink = document.getElementById("footerProfileLink");
  if (footerProfileLink) {
    footerProfileLink.addEventListener("click", () => {
      renderProfile();
      openModal("profileModal");
    });
  }

  // Search input with debounce
  const searchInput = document.getElementById("menuSearchInput");
  const clearSearchBtn = document.getElementById("menuSearchClear");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle("visible", state.searchQuery.length > 0);
      }
      renderMenu();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      state.searchQuery = "";
      clearSearchBtn.classList.remove("visible");
      renderMenu();
    });
  }

  // Sort select
  const sortSelect = document.getElementById("menuSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderMenu();
    });
  }

  // Category Tabs
  document.querySelectorAll(".category-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedCategory = btn.getAttribute("data-category");
      updateFilterTabButtons();
      renderMenu();
    });
  });

  // Dietary chips
  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      state.dietaryFilter = state.dietaryFilter === filter ? null : filter;
      updateChipButtons();
      renderMenu();
    });
  });

  // Modal Closers
  document.getElementById("closeItemModalBtn")?.addEventListener("click", () => closeModal("itemDetailsModal"));
  document.getElementById("modalCancelBtn")?.addEventListener("click", () => closeModal("itemDetailsModal"));
  document.getElementById("closeCartModalBtn")?.addEventListener("click", () => closeModal("cartModal"));
  document.getElementById("closeResModalBtn")?.addEventListener("click", () => closeModal("reservationModal"));
  document.getElementById("cancelResBtn")?.addEventListener("click", () => closeModal("reservationModal"));
  document.getElementById("closeProfileModalBtn")?.addEventListener("click", () => closeModal("profileModal"));
  document.getElementById("closeProfileBtn")?.addEventListener("click", () => closeModal("profileModal"));
  document.getElementById("successDoneBtn")?.addEventListener("click", () => closeModal("successModal"));

  document.getElementById("successViewProfileBtn")?.addEventListener("click", () => {
    closeModal("successModal");
    renderProfile();
    openModal("profileModal");
  });

  document.getElementById("profileNewResBtn")?.addEventListener("click", () => {
    closeModal("profileModal");
    tryOpenReservation();
  });

  // Backdrop click close for all modals
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Escape key closes active modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.active").forEach(m => closeModal(m.id));
    }
  });

  // Item Detail Modal Stepper & Add to Cart
  document.getElementById("itemQtyDecBtn")?.addEventListener("click", () => {
    if (state.itemModalQty > 1) {
      state.itemModalQty--;
      document.getElementById("itemQtyDisplay").textContent = state.itemModalQty;
      updateItemModalAddButton();
    }
  });

  document.getElementById("itemQtyIncBtn")?.addEventListener("click", () => {
    if (state.itemModalQty < 50) {
      state.itemModalQty++;
      document.getElementById("itemQtyDisplay").textContent = state.itemModalQty;
      updateItemModalAddButton();
    }
  });

  document.getElementById("addToCartBtn")?.addEventListener("click", () => {
    if (state.activeModalItem) {
      addToCart(state.activeModalItem, state.itemModalQty);
      closeModal("itemDetailsModal");
    }
  });

  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    if (state.cart.length > 0) {
      state.cart = [];
      saveCart();
      updateCartBadge();
      renderCart();
      showToast("Order cart cleared");
    }
  });

  document.getElementById("cartProceedBookBtn")?.addEventListener("click", () => {
    closeModal("cartModal");
    tryOpenReservation();
  });

  // Reservation Form Submit
  const resForm = document.getElementById("reservationForm");
  if (resForm) {
    resForm.addEventListener("submit", handleReservationSubmit);
  }
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  void toast.offsetWidth;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  try {
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  } catch {
    return timeStr;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
