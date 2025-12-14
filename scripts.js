const products = [
  { id: 1,  name: "Backpack", price: 20, details: "Durable school backpack", image: "img/backpack.jpg" },
  { id: 2,  name: "Notebook Pack (x5)", price: 8, details: "Set of notebooks", image: "img/notebooks.jpg" },
  { id: 3,  name: "Pencil Case", price: 6, details: "Includes supplies", image: "img/pencilcase.jpg" },
  { id: 4,  name: "Geometry Set", price: 5, details: "Ruler, triangle, compass", image: "img/geometry.jpg" },
  { id: 5,  name: "Calculator", price: 15, details: "Scientific calculator", image: "img/calculator.jpg" },
  { id: 6,  name: "Water Bottle", price: 7, details: "Reusable BPA-free", image: "img/bottle.jpg" },
  { id: 7,  name: "Art Kit", price: 12, details: "Crayons, markers", image: "img/artkit.jpg" },
  { id: 8,  name: "School Shoes", price: 25, details: "Durable daily shoes", image: "img/shoes.jpg" },
  { id: 9,  name: "Lunch Box", price: 10, details: "Insulated container", image: "img/lunchbox.jpg" },
  { id: 10, name: "Reading Books Set", price: 18, details: "Books ages 6-12", image: "img/books.jpg" }
];


// Products Code

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(item => {
    grid.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <h5>${item.name}</h5>
            <p class="text-muted">${item.details}</p>
            <p class="fw-bold">€${item.price.toFixed(2)}</p>
            <button class="btn btn-primary mt-auto add-btn" data-id="${item.id}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".add-btn").forEach(btn =>
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)))
  );
}

renderProducts();


// Shopping Cart Code

let cart = [];

function addToCart(id) {
  const item = cart.find(x => x.id === id);

  if (item) item.qty++;
  else {
    const p = products.find(p => p.id === id);
    cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  }

  updateCart();
}

function updateCart() {
  const badge = document.getElementById("cart-count");
  const items = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");

  items.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    const sub = item.qty * item.price;
    totalQty += item.qty;
    totalPrice += sub;

    items.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td class="text-end">€${item.price.toFixed(2)}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-end">€${sub.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">✕</button></td>
      </tr>
    `;
  });

  badge.textContent = totalQty;
  totalSpan.textContent = totalPrice.toFixed(2);
}

function removeFromCart(id) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty--;
  if (item.qty === 0) cart = cart.filter(x => x.id !== id);

  updateCart();
}


// Buttons Cart

document.getElementById("open-cart-btn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  document.getElementById("cart-panel").classList.remove("d-none");
});

document.getElementById("close-cart-btn").addEventListener("click", () => {
  document.getElementById("cart-panel").classList.add("d-none");
});


// Checkout Code

document.getElementById("checkout-btn").addEventListener("click", () => {
  document.getElementById("cart-panel").classList.add("d-none");

  const section = document.getElementById("checkout-section");
  section.classList.remove("d-none");
  section.scrollIntoView({ behavior: "smooth" });
});


// Form Check

document.getElementById("checkout-form").addEventListener("submit", e => {
  e.preventDefault();

  if (
    fullname.value.trim() === "" ||
    email.value.trim() === "" || !email.value.includes("@") ||
    !/^[0-9]+$/.test(phone.value.trim()) ||
    zip.value.trim().length === 0 || zip.value.trim().length > 6 ||
    country.value.trim() === "" ||
    address.value.trim() === ""
  ) {
    alert("Please complete all fields correctly.");
    return;
  }

  showConfirmation();
});


// Confirmation Message

function showConfirmation() {
  document.getElementById("checkout-section").classList.add("d-none");

  const box = document.getElementById("confirmation-details");
  const section = document.getElementById("confirmation-section");

  let subtotal = 0;
  let list = "";

  cart.forEach(item => {
    const sub = item.price * item.qty;
    subtotal += sub;
    list += `<li>${item.qty} x ${item.name} — €${sub.toFixed(2)}</li>`;
  });

  let discount = cart.reduce((s, i) => s + i.qty, 0) >= 3 ? subtotal * 0.1 : 0;
  let final = subtotal - discount;

  box.innerHTML = `
    <h4>Donation Summary</h4>
    <ul>${list}</ul>
    <p><strong>Subtotal:</strong> €${subtotal.toFixed(2)}</p>
    <p><strong>Discount:</strong> €${discount.toFixed(2)}</p>
    <p><strong>Total:</strong> €${final.toFixed(2)}</p>
  `;

  section.classList.remove("d-none");
}
