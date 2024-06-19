// Import cart and addToCart function from the data/cart.js module
import { cart, addToCart } from '../data/cart.js';
// Import products from the data/products.js module
import { products } from '../data/products.js';

// Function to render products
function renderProducts(productsToRender) {
  let productsHTML = '';

  // Loop through each product and create HTML for it
  productsToRender.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>
        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>
        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>
        <div class="product-price">
          ${product.getPrice()}
        </div>
        <div class="product-quantity-container">
          <select class="product-quantity-select">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        ${product.extraInfoHTML()}
        <div class="product-spacer"></div>
        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>
        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  // Set the inner HTML of the products grid to the generated HTML
  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // If no products matched the search, display a message
  if (productsToRender.length === 0) {
    document.querySelector('.js-products-grid').innerHTML = '<p>No products matched your search.</p>';
  }

  // Attach event listeners to the add-to-cart buttons
  attachAddToCartEventListeners();
}

// Function to attach event listeners to add-to-cart buttons
function attachAddToCartEventListeners() {
  let timeoutMap = new Map(); // Map to store timeouts for each product

  // Select all add-to-cart buttons and add click event listeners
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId; // Get product ID from data attribute
      const productContainer = button.closest('.product-container'); // Find the product container
      const quantitySelect = productContainer.querySelector('.product-quantity-select'); // Find the quantity select element
      const quantity = parseInt(quantitySelect.value, 10); // Get the selected quantity

      addToCart(productId, quantity); // Pass the selected quantity to addToCart
      updateCartQuantity(); // Update the cart quantity display

      const addedToCartMessage = productContainer.querySelector('.added-to-cart'); // Find the added-to-cart message
      addedToCartMessage.classList.add('show'); // Show the added-to-cart message

      // Clear any existing timeout for this product
      if (timeoutMap.has(productId)) {
        clearTimeout(timeoutMap.get(productId));
      }

      // Set a new timeout to hide the message after 2 seconds
      const timeoutId = setTimeout(() => {
        addedToCartMessage.classList.remove('show');
        timeoutMap.delete(productId); // Remove the timeout from the map
      }, 2000);

      // Store the timeout ID in the map
      timeoutMap.set(productId, timeoutId);
    });
  });
}

// Function to update the cart quantity display
function updateCartQuantity() {
  let cartQuantity = 0;

  // Calculate the total quantity of items in the cart
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Update the cart quantity display
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// Search functionality
document.querySelector('.search-button').addEventListener('click', () => {
  const searchTerm = document.querySelector('.search-bar').value.toLowerCase(); // Get the search term
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm)); // Filter products by search term
  renderProducts(filteredProducts); // Render the filtered products
});

// Initial render of all products
renderProducts(products);

// Update the cart quantity display to reflect the initial state of the cart
updateCartQuantity();
