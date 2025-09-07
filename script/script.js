
const category_api = "https://openapi.programming-hero.com/api/categories";
const all_plant_api = "https://openapi.programming-hero.com/api/plants";
const cardContainer = document.getElementById("card-container");
const categoryContainer = document.getElementById("category");
const cartItemsContainer = document.getElementById("cart-items");

let cart = {}; // store items as { id: { name, price, qty } }
const spinner = document.getElementById("spinner");
const modal = document.getElementById("my_modal_4");
const modalContent = document.getElementById("modal-content");

function showSpinner(){
    spinner.classList.remove("hidden");
    cardContainer.classList.add("hidden");
}


function hideSpinner(){
    spinner.classList.add("hidden");
    cardContainer.classList.remove("hidden");
}

function showPlantModal(id) {
  // show modal immediately with a tiny skeleton/loader
  modalContent.innerHTML = `

  `;
  modal.showModal();

  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const plant = data?.plants;
      if (!plant) {
        modalContent.innerHTML = `
          <div class="text-red-600">Could not load plant details.</div>
        `;
        return;
      }

      const imgSrc = plant.image;

      modalContent.innerHTML = `
        <h2 class="text-2xl font-bold py-4">${plant.name}</h2>
        <figure>
          <img src="${imgSrc}" alt="${plant.name}"
               class="w-full h-80 object-cover rounded-xl mb-4"/>
        </figure>
        <p class="mb-4 text-gray-700"><span class="font-bold">Category:</span> ${plant.category}</p>
        <p class=" mb-2"><span class="font-bold">Price:</span> $${plant.price}</p>
        <p class="mb-4 text-gray-700"><span class="font-bold">Description:</span> ${plant.description}</p>
      `;
    })
  
}

// Render plants
function renderPlants(plants) {

  cardContainer.innerHTML = "";
  plants.forEach((plant) => {
    let card = document.createElement("div");
    card.innerHTML = `
      <div class="card bg-base-100 w-80 h-full shadow-sm rounded-2xl px-4 py-4 flex flex-col justify-between">
        <figure>
          <img src="${plant.image}" alt="${plant.name}"
               class="rounded-xl h-40 w-full object-cover"/>
        </figure>
        <div class="items-center text-left flex-1">
          <div class="my-4">
            <h2 class="font-semibold text-lg mb-4" cursor-pointer" id="card-title" data-id="${plant.id}">${plant.name}</h2>
            <p class="text-[#1F2937]">${plant.description}</p>
          </div>
          <div class="flex justify-between mb-4">
            <div class="level-tag text-[#15803D] bg-[#DCFCE7] rounded-3xl px-4 py-2">
              ${plant.category}
            </div>
            <p class="font-semibold">$${plant.price}</p>
          </div>
        </div>
        <button class="btn text-white bg-[#15803D] rounded-3xl add-to-cart">Add to Cart</button>
      </div>
    `;

    // Add event listener for cart
    card.querySelector("#card-title").addEventListener("click", () => {
      showPlantModal(plant.id);
    });

    card.querySelector(".add-to-cart").addEventListener("click", () => {
      addToCart(plant);
    });

    cardContainer.appendChild(card);
  });
hideSpinner();

}

// Add to Cart
function addToCart(plant) {
  if (cart[plant.id]) {
    cart[plant.id].qty += 1;
  } else {
    cart[plant.id] = { name: plant.name, price: plant.price, qty: 1 };
  }
  renderCart();
}

// Remove item from cart
function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

// Render Cart
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let total = 0;
  let keys = Object.keys(cart);

  if (keys.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Your cart is empty</p>`;
  } else {
    keys.forEach((id) => {
      let item = cart[id];
      total += item.price * item.qty;

      let div = document.createElement("div");
      div.className =
        "bg-[#F0FDF4] p-2 flex justify-between rounded-xl my-2 items-center";

      div.innerHTML = `
        <div class="flex-1">
          <h4>${item.name}</h4>
          <p>$${item.price} x ${item.qty}</p>
        </div>
        <button class=" px-2 text-2xl">x</button>
      `;

      // remove button event
      div.querySelector("button").addEventListener("click", () => {
        removeFromCart(id);
      });

      cartItemsContainer.appendChild(div);
    });
  }

  // Update total
  document.querySelector(
    ".total"
  ).innerText = "$" + total;
}

// Load Plants
function loadAllPlants() {
    showSpinner();
  fetch(all_plant_api)
    .then((res) => res.json())
    .then((data) => renderPlants(data.plants));
}

function loadPlantsByCategory(id) {
    showSpinner();
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => renderPlants(data.plants));
}

// Load Categories
fetch(category_api)
  .then((res) => res.json())
  .then((data) => {
    data.categories.forEach((cat) => {
      let item = document.createElement("li");
      item.className =
        "cursor-pointer py-2 px-4 rounded-lg hover:bg-green-100 text-[#1F2937]";
      item.innerText = cat.category_name;

      item.addEventListener("click", () => {
        Array.from(categoryContainer.children).forEach((child) =>
          child.classList.remove("bg-green-600", "text-white")
        );

        item.classList.add("bg-green-600", "text-white");
        loadPlantsByCategory(cat.id);
      });

      categoryContainer.appendChild(item);
    });

    // All Plants option
    let allItem = document.createElement("li");
    allItem.className =
      "cursor-pointer py-2 px-4 rounded-lg hover:bg-green-100 text-[#1F2937]";
    allItem.innerText = "All Plants";
    allItem.addEventListener("click", () => {
      Array.from(categoryContainer.children).forEach((child) =>
        child.classList.remove("bg-green-600", "text-white")
      );
      allItem.classList.add("bg-green-600", "text-white");
      loadAllPlants();
    });
    categoryContainer.prepend(allItem);
  });

loadAllPlants();