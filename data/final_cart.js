import { getProduct } from '../../data/products.js';
import { addToCart } from '../../data/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if it's the initial load
    const initialLoad = localStorage.getItem('initialLoad');
    if (initialLoad !== 'true') {
        // Clear previous orders from local storage
        localStorage.removeItem('orders');
        // Set the flag to indicate the initial load has been completed
        localStorage.setItem('initialLoad', 'true');
    }

    renderOrders();

    // Update cart quantity in header
    const cartQuantityElement = document.getElementById('cart-quantity');
    cartQuantityElement.textContent = 0;  // Cart is empty after placing an order
});

function renderOrders() {
    const ordersGrid = document.getElementById('orders-grid');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let ordersHTML = '';

    orders.forEach((order) => {
        order.items.forEach((cartItem) => {
            const product = getProduct(cartItem.productId);
            ordersHTML += `
            <div class="order-container">
              <div class="order-header">
                <div class="order-header-left-section">
                  <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${(product.priceCents / 100 * cartItem.quantity).toFixed(2)}</div>
                  </div>
                </div>
                <div class="order-header-right-section">
                  <div class="order-header-label">Order ID:</div>
                  <div>${order.id}</div>
                </div>
              </div>
              <div class="order-details-grid">
                <div class="product-image-container">
                  <img class="product-image" src="${product.image}">
                </div>
                <div class="product-details">
                  <div class="product-name">
                    ${product.name}
                  </div>
                  <div class="product-delivery-date">
                    Arriving on: ${new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                  <div class="product-quantity">
                    Quantity: ${cartItem.quantity}
                  </div>
                  <button class="buy-again-button button-primary" data-product-id="${cartItem.productId}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                  </button>
                  <button class="remove-item-button button-secondary" data-order-id="${order.id}">
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
            `;
        });
    });

    ordersGrid.innerHTML = ordersHTML;

    // Add event listeners to 'Buy it again' buttons
    document.querySelectorAll('.buy-again-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    // Add event listeners to 'Remove Item' buttons
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-order-id');
            removeOrder(orderId);
            renderOrders(); // Re-render orders after removing the item
        });
    });
}

function removeOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
}
