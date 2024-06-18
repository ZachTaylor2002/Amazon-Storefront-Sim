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
                  <button class="cancel-order-button button-secondary" data-order-id="${order.id}">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
            `;
        });
    });

    ordersGrid.innerHTML = ordersHTML;

    // Add event listeners to 'Cancel Order' buttons
    document.querySelectorAll('.cancel-order-button').forEach(button => {
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

// Add the CSS for the 'Cancel Order' button
const style = document.createElement('style');
style.innerHTML = `
    .cancel-order-button {
        background-color: #ff4c4c; /* Bright red color */
        color: white; /* White text */
        border: none; /* Remove default border */
        padding: 10px 20px; /* Padding for button */
        font-size: 16px; /* Font size */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s ease; /* Smooth transition for background color */
    }

    .cancel-order-button:hover {
        background-color: #e64444; /* Slightly darker red on hover */
    }

    .cancel-order-button:active {
        background-color: #cc3c3c; /* Even darker red when clicked */
    }
`;
document.head.appendChild(style);
