const state = {
    dishes: [],
    cart: [],
    search: ""
};

const menuContainer = document.querySelector("#menu-items-container");
const searchInput = document.querySelector("#menu-search");
const cartSidebar = document.querySelector("#cart-sidebar");
const cartToggleBtn = document.querySelector("#cart-toggle");
const cartCloseBtn = document.querySelector("#cart-close");
const cartItemsContainer = document.querySelector("#cart-items-container");
const cartTotalEl = document.querySelector("#cart-total");
const cartBadgeEl = document.querySelector("#cart-badge");

async function loadMenu() {
  menuContainer.textContent = "Loading menu...";
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("HTTP error " + res.status);
    state.dishes = await res.json();
    render();
  } catch (err) {
    menuContainer.textContent = "Could not load the menu.";
    console.error(err);
  }
}

function saveCart() {
  localStorage.setItem("addiseats_cart", JSON.stringify(state.cart));
}

function loadCart() {
  const saved = localStorage.getItem("addiseats_cart");
  if (saved) {
    state.cart = JSON.parse(saved);
  }
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}


function renderMenu() {
  const term = state.search.toLowerCase().trim();
  const filtered = state.dishes.filter(dish => 
    dish.name.toLowerCase().includes(term)
  );
  if (filtered.length === 0) {
    menuContainer.innerHTML = `<p style="grid-column: 1/-1;">No dishes found matching</p>`;
    return;
  }
  menuContainer.innerHTML = filtered.map(dish => `
    <article class="food-card" data-id="${dish.id}">
      <img src="${dish.image}" alt="${dish.name}">
      <h3>${dish.name}</h3>
      <div class="card-footer">
        <span class="price">${dish.price} ETB</span>
        <button class="add-btn add" aria-label="Add to cart">Add</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div>
          <p class="item-name">${item.name} <span class="qty">x${item.qty}</span></p>
          <p class="item-price">${item.price * item.qty} ETB</p>
        </div>
        <button class="remove-btn" aria-label="Remove item">&times;</button>
      </div>
    `).join("");
  }
  cartTotalEl.textContent = `${cartTotal()} ETB`;
  cartBadgeEl.textContent = cartCount();
}

function render() {
  renderMenu();
  renderCart();
}


searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderMenu();
});


menuContainer.addEventListener("click", (e) => {
  if (!e.target.matches(".add")) return;
  const card = e.target.closest(".food-card");
  const id = Number(card.dataset.id);
  const dish = state.dishes.find(d => d.id === id);
  const existingLine = state.cart.find(item => item.id === id);
  if (existingLine) {
    existingLine.qty++;
  } else {
    state.cart.push({ ...dish, qty: 1 });
  }
  saveCart();
  render();
});

cartItemsContainer.addEventListener("click", (e) => {
  if (!e.target.matches(".remove-btn")) return;
  const itemEl = e.target.closest(".cart-item");
  const id = Number(itemEl.dataset.id);
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  render();
});

async function init() {
  loadCart();
  await loadMenu();
}

init();