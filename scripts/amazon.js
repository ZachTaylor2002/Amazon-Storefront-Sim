import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';

let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select>
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

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

let timeoutMap = new Map(); // Map to store timeouts for each product

document.querySelectorAll('.js-add-to-cart').forEach((button) => { 
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        addToCart(productId);
        updateCartQuantity();

        const productContainer = button.closest('.product-container');
        const addedToCartMessage = productContainer.querySelector('.added-to-cart');

        addedToCartMessage.classList.add('show');

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
