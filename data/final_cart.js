// Import necessary functions from external modules
import { getProduct } from '../../data/products.js';
import { addToCart } from '../../data/cart.js';

// When the DOM content is loaded, execute this function
document.addEventListener('DOMContentLoaded', () => {
    // Check if it's the initial load
    const initialLoad = localStorage.getItem('initialLoad');
    if (initialLoad !== 'true') {
        // Clear previous orders from local storage
        localStorage.removeItem('orders');
        // Set the flag to indicate the initial load has been completed
        localStorage.setItem('initialLoad', 'true');
    }

    // Render the orders on the webpage
    renderOrders();

    // Update cart quantity in header
    const cartQuantityElement = document.getElementById('cart-quantity');
    cartQuantityElement.textContent = 0;  // Cart is empty after placing an order
});

// Function to render orders on the webpage
function renderOrders() {
    const ordersGrid = document.getElementById('orders-grid');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let ordersHTML = '';

    orders.forEach((order) => {
        order.items.forEach((cartItem) => {
            // Get product details for each item in the order
            const product = getProduct(cartItem.productId);
            // Generate HTML for displaying each order
            ordersHTML += `
            <div class="order-container">
              <!-- Order header section -->
              <div class="order-header">
                <!-- Left section of the header -->
                <div class="order-header-left-section">
                  <!-- Order placement date -->
                  <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <!-- Total price of the order -->
                  <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${(product.priceCents / 100 * cartItem.quantity).toFixed(2)}</div>
                  </div>
                </div>
                <!-- Right section of the header -->
                <div class="order-header-right-section">
                  <!-- Order ID -->
                  <div class="order-header-label">Order ID:</div>
                  <div>${order.id}</div>
                </div>
              </div>
              <!-- Order details section -->
              <div class="order-details-grid">
                <!-- Product image -->
                <div class="product-image-container">
                  <img class="product-image" src="${product.image}">
                </div>
                <!-- Product details -->
                <div class="product-details">
                  <!-- Product name -->
                  <div class="product-name">
                    ${product.name}
                  </div>
                  <!-- Estimated delivery date -->
                  <div class="product-delivery-date">
                    Arriving on: ${new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                  <!-- Quantity of the product -->
                  <div class="product-quantity">
                    Quantity: ${cartItem.quantity}
                  </div>
                  <!-- Button to cancel the order -->
                  <button class="cancel-order-button button-secondary" data-order-id="${order.id}">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
            `;
        });
    });

    // Display the generated HTML for orders on the webpage
    ordersGrid.innerHTML = ordersHTML;

    // Add event listeners to 'Cancel Order' buttons
    document.querySelectorAll('.cancel-order-button').forEach(button => {
        button.addEventListener('click', () => {
            // Get the order ID from the data attribute
            const orderId = button.getAttribute('data-order-id');
            // Remove the order from local storage
            removeOrder(orderId);
            // Re-render orders after removing the item
            renderOrders();
        });
    });
}

// Function to remove an order from local storage
function removeOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    // Filter out the order with the given ID
    orders = orders.filter(order => order.id !== orderId);
    // Update the orders in local storage
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Add CSS styles for the 'Cancel Order' button dynamically
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
// Append the styles to the head of the document
document.head.appendChild(style);
