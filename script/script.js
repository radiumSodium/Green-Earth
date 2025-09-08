// API 
const CATEGORY_API = "https://openapi.programming-hero.com/api/categories";
const PLANTS_API = "https://openapi.programming-hero.com/api/plants";

// DOM Elements
const cardContainer = document.getElementById("card-container");
const categoryList = document.getElementById("category");
const cartContainer = document.getElementById("cart-items");
const spinner = document.getElementById("spinner");
const modal = document.getElementById("my_modal_4");
const modalBody = document.getElementById("modal-content");

// Cart object to track items
let cart = {};

// Spinner
function showSpinner() {
  spinner.classList.remove("hidden");
  cardContainer.classList.add("hidden");
}

function hideSpinner() {
  spinner.classList.add("hidden");
  cardContainer.classList.remove("hidden");
}

// Show Plant Details Modal
function showPlantModal(id) {
  modal.showModal();

  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const plant = data?.plants;
      if (!plant) {
        modalBody.innerHTML = `<div class="text-red-500">Unable to load plant details.</div>`;
        return;
      }

      modalBody.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${plant.name}</h2>
        <figure>
          <img src="${plant.image}" alt="${plant.name}"
               class="w-full h-80 object-cover rounded-xl mb-4"/>
        </figure>
        <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
        <p class="mb-2"><strong>Price:</strong> $${plant.price}</p>
        <p class="text-gray-700"><strong>Description:</strong> ${plant.description}</p>
      `;
    });
}

// Render Plants as Cards
function renderPlants(plants) {
  cardContainer.innerHTML = "";

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="card bg-base-100 w-80 h-full shadow-sm rounded-2xl px-4 py-4 flex flex-col justify-between">
        <figure>
          <img src="${plant.image}" alt="${plant.name}"
               class="rounded-xl h-40 w-full object-cover"/>
        </figure>
        <div class="flex-1 text-left my-4">
          <h2 class="font-semibold text-lg mb-2 cursor-pointer" data-id="${plant.id}">${plant.name}</h2>
          <p class="text-[#1F2937]">${plant.description}</p>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="px-4 py-2 rounded-3xl bg-[#DCFCE7] text-[#15803D]">
            ${plant.category}
          </span>
          <p class="font-semibold">$${plant.price}</p>
        </div>
        <button class="btn bg-[#15803D] text-white rounded-3xl add-to-cart">Add to Cart</button>
      </div>
    `;

    // Open modal on title click
    card
      .querySelector("h2")
      .addEventListener("click", () => showPlantModal(plant.id));

    // Add to cart button
    card
      .querySelector(".add-to-cart")
      .addEventListener("click", () => addToCart(plant));

    cardContainer.appendChild(card);
  });

  hideSpinner();
}

// Add Plant to Cart
function addToCart(plant) {
  if (cart[plant.id]) {
    cart[plant.id].qty += 1;
  } else {
    cart[plant.id] = { name: plant.name, price: plant.price, qty: 1 };
  }
  renderCart();
}

// Remove Plant from Cart
function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

// Render Cart Items
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Your cart is empty</p>`;
  } else {
    ids.forEach((id) => {
      const item = cart[id];
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.className =
        "bg-[#F0FDF4] p-2 flex justify-between rounded-xl my-2 items-center";

      div.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price} × ${item.qty}</p>
        </div>
        <button class="px-2 text-xl">✕</button>
      `;

      // Remove item on click
      div
        .querySelector("button")
        .addEventListener("click", () => removeFromCart(id));
      cartContainer.appendChild(div);
    });
  }

  document.querySelector(".total").innerText = "$" + total;
}

// Fetch and Render All Plants
function loadAllPlants() {
  showSpinner();
  fetch(PLANTS_API)
    .then((res) => res.json())
    .then((data) => renderPlants(data.plants));
}

// Fetch and Render Plants by Category
function loadPlantsByCategory(categoryId) {
  showSpinner();
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => renderPlants(data.plants));
}

// Fetch and Render Categories
fetch(CATEGORY_API)
  .then((res) => res.json())
  .then((data) => {
    // Add "All Plants" option first
    const allItem = document.createElement("li");
    allItem.className =
      "cursor-pointer py-2 px-4 rounded-lg hover:bg-green-100 text-[#1F2937]";
    allItem.textContent = "All Plants";
    allItem.addEventListener("click", () => {
      Array.from(categoryList.children).forEach((li) =>
        li.classList.remove("bg-green-600", "text-white")
      );
      allItem.classList.add("bg-green-600", "text-white");
      loadAllPlants();
    });
    categoryList.appendChild(allItem);

    // Render categories from API
    data.categories.forEach((cat) => {
      const li = document.createElement("li");
      li.className =
        "cursor-pointer py-2 px-4 rounded-lg hover:bg-green-100 text-[#1F2937]";
      li.textContent = cat.category_name;

      li.addEventListener("click", () => {
        Array.from(categoryList.children).forEach((li) =>
          li.classList.remove("bg-green-600", "text-white")
        );
        li.classList.add("bg-green-600", "text-white");
        loadPlantsByCategory(cat.id);
      });

      categoryList.appendChild(li);
    });
  });

// Load everything on first visit
loadAllPlants();
