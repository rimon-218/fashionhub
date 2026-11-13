
// Products

const products = [
  {
    id: 1,
    name: "Classic Men's Jacket",
    category: "Men",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
  },
  {
    id: 2,
    name: "Women's Elegant Dress",
    category: "Women",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600",
  },
  {
    id: 3,
    name: "Premium Sneakers",
    category: "Shoes",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    id: 4,
    name: "Luxury Handbag",
    category: "Accessories",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
  },
  {
    id: 5,
    name: "Casual Men's Shirt",
    category: "Men",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
  },
  {
    id: 6,
    name: "Women's Fashion Top",
    category: "Women",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600",
  },
  {
    id: 7,
    name: "Sport Sneakers",
    category: "Shoes",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600",
  },
  {
    id: 8,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
  },
  {
    id: 9,
    name: "Men's Casual Hoodie",
    category: "Men",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
  },
  {
    id: 10,
    name: "Women's Handbag",
    category: "Women",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
  },
  {
    id: 11,
    name: "Running Shoes",
    category: "Shoes",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
  },
  {
    id: 12,
    name: "Fashion Watch",
    category: "Accessories",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600",
  },
];

// ==============================
// Dom elements
// ==============================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutModal = document.getElementById("checkoutModal");
const ordersModal = document.getElementById("ordersModal");
const successModal = document.getElementById("successModal");

const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

// ==============================
// Storage
// ==============================

function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

let cart = readStorage("fashionCart", []);
let orders = readStorage("fashionOrders", []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(orders)) orders = [];

cart = cart.filter(
  (item) =>
    products.some((product) => product.id === item.id) &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 20,
);

function saveCart() {
  localStorage.setItem("fashionCart", JSON.stringify(cart));
}

function saveOrders() {
  localStorage.setItem("fashionOrders", JSON.stringify(orders));
}

// ==============================
// Helper functions
// ==============================

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ==============================
// Display products
// ==============================

function displayProducts() {
  const search = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = "";

  document.getElementById("emptyMessage").hidden = filtered.length > 0;

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const categoryText = document.createElement("small");
    categoryText.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-btn";
    button.textContent = "Add to Cart";

    button.addEventListener("click", () => {
      addToCart(product.id);
    });

    bottom.append(price, button);
    info.append(categoryText, name, bottom);
    card.append(image, info);

    productGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortFilter.addEventListener("change", displayProducts);

// ==============================
// Add to cart
// ==============================

function addToCart(id) {
  const item = cart.find((product) => product.id === id);

  if (item) {
    if (item.quantity >= 20) {
      showToast("Maximum quantity reached!");
      return;
    }

    item.quantity++;
  } else {
    cart.push({
      id,
      quantity: 1,
    });
  }

  saveCart();
  updateCart();

  showToast("Product added to cart!");
}

// ==============================
// Quantity control
// ==============================

function changeQuantity(id, amount) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  const newQuantity = item.quantity + amount;

  if (newQuantity > 20) {
    showToast("Maximum quantity is 20!");
    return;
  }

  if (newQuantity <= 0) {
    cart = cart.filter((product) => product.id !== id);
  } else {
    item.quantity = newQuantity;
  }

  saveCart();
  updateCart();
}

// ==============================
// Remove product
// ==============================

function removeItem(id) {
  cart = cart.filter((product) => product.id !== id);

  saveCart();
  updateCart();

  showToast("Product removed!");
}

// ==============================
// Update cart
// ==============================

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);

    if (!product) return;

    total += product.price * item.quantity;
    count += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price * item.quantity);

    const quantity = document.createElement("div");
    quantity.className = "quantity";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");

    minus.addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });

    const number = document.createElement("span");
    number.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");

    plus.addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });

    quantity.append(minus, number, plus);
    info.append(name, price, quantity);

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.textContent = "Remove";

    remove.addEventListener("click", () => {
      removeItem(item.id);
    });

    row.append(image, info, remove);
    cartItems.appendChild(row);
  });

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    empty.style.padding = "25px 0";
    cartItems.appendChild(empty);
  }

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  document.getElementById("checkoutTotal").textContent = formatPrice(total);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);

    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

// ==============================
// Panel and modal control
// ==============================

function updateOverlay() {
  const isOpen =
    cartPanel.classList.contains("open") ||
    checkoutModal.classList.contains("open") ||
    ordersModal.classList.contains("open") ||
    successModal.classList.contains("open");

  overlay.classList.toggle("show", isOpen);
}

function closeAll() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");

  [checkoutModal, ordersModal, successModal].forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  updateOverlay();
}

function openCart() {
  closeAll();

  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");

  updateOverlay();
}

function openModal(modal) {
  closeAll();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  updateOverlay();
}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeAll);

document.getElementById("closeCheckout").addEventListener("click", closeAll);

document.getElementById("closeOrders").addEventListener("click", closeAll);

overlay.addEventListener("click", closeAll);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAll();
});

// ==============================
// Checkout
// ==============================

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  openModal(checkoutModal);
  document.getElementById("checkoutTotal").textContent =
    formatPrice(getCartTotal());
});

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Your cart is empty!");
    closeAll();
    return;
  }

  const form = event.target;

  if (!form.reportValidity()) return;

  const formData = new FormData(form);

  const customer = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    country: formData.get("country"),
    address: formData.get("address").trim(),
  };

  if (
    customer.name.length < 2 ||
    customer.name.length > 100 ||
    customer.address.length < 5 ||
    customer.address.length > 500 ||
    !/^\+?[0-9\s()-]{7,20}$/.test(customer.phone)
  ) {
    showToast("Please check your information!");
    return;
  }

  const orderItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const total = Number(getCartTotal().toFixed(2));

  const order = {
    id: "FH-" + Date.now(),
    customer,
    items: orderItems,
    total,
    currency: "USD",
    status: "Demo order received",
    paymentStatus: "Not paid",
    date: new Date().toLocaleString(),
  };

  try {
    orders.unshift(order);

    saveOrders();

    cart = [];
    saveCart();
    updateCart();

    form.reset();

    document.getElementById("successOrderId").textContent =
      "Order ID: " + order.id;

    openModal(successModal);
  } catch (error) {
    orders.shift();
    showToast("Could not save order. Storage may be full.");
  }
});

// ==============================
// Order history
// ==============================

function displayOrders() {
  const history = document.getElementById("orderHistory");

  history.innerHTML = "";

  if (orders.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No orders found.";
    message.style.padding = "20px 0";
    history.appendChild(message);
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "order-card";

    const id = document.createElement("strong");
    id.textContent = order.id;

    const date = document.createElement("p");
    date.textContent = "Date: " + order.date;

    const status = document.createElement("p");
    status.textContent = "Status: " + order.status;

    const payment = document.createElement("p");
    payment.textContent = "Payment: " + order.paymentStatus;

    const total = document.createElement("p");
    total.textContent = "Total: " + formatPrice(order.total);

    const customer = document.createElement("p");
    customer.textContent = "Customer: " + order.customer.name;

    const itemList = document.createElement("p");

    itemList.textContent = order.items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(", ");

    card.append(id, date, customer, itemList, status, payment, total);

    history.appendChild(card);
  });
}

document.getElementById("ordersBtn").addEventListener("click", () => {
  displayOrders();
  openModal(ordersModal);
});

// ==============================
// Dark / Light mode
// ==============================

const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  const dark = theme === "dark";

  document.body.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "☀️" : "🌙";

  localStorage.setItem("fashionTheme", theme);
}

const savedTheme = localStorage.getItem("fashionTheme");

setTheme(savedTheme === "dark" ? "dark" : "light");

themeBtn.addEventListener("click", () => {
  const dark = document.body.classList.contains("dark");

  setTheme(dark ? "light" : "dark");
});

// ==============================
// Newsletter emo
// ==============================

document
  .getElementById("newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    showToast("Demo only: Newsletter is not connected.");
    event.target.reset();
  });

// ==============================
// Initialization
// ==============================

displayProducts();
updateCart();

console.log("Global FashionHub loaded successfully!");
