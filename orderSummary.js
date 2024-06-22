// Import necessary functions and data from external modules
import { cart, removeFromCart, updateDeliveryOption, updateQuantityInCart } from "./cart.js";
import { products, getProduct } from "./products.js";
import { formatCurrency } from "./money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // Importing dayjs library for date manipulation
import { deliveryOptions, getDeilveryOption } from './deliveryOptions.js'; // Importing delivery options data
import { renderPaymentSummary } from "./paymentSummary.js"; // Importing function to render payment summary

// Function to render the order summary section on the webpage
export function renderOrderSummary() {
    let cartSummaryHTML = ''; // Initialize an empty string to hold the HTML for the cart summary

    // Check if the cart is empty
    if (cart.length === 0) {
        // Cart is empty, display a message and a button to view products
        cartSummaryHTML = `
            <div class="empty-cart-message">
                Your cart is empty.
            </div>
            <button class="view-products-button button-primary" onclick="window.location.href='amazon.html'">
                View products
            </button>
        `;
    } else {
        // Cart is not empty, iterate over each item in the cart
        cart.forEach((cartItem) => {
            // Get details of the product in the cart item
            const productId = cartItem.productId;
            const matchingProduct = getProduct(productId);
            const deliveryOptionId = cartItem.deliveryOptionId;
            const deliveryOption = getDeilveryOption(deliveryOptionId);
            const today = dayjs(); // Get the current date
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate delivery date
            const dateString = deliveryDate.format('dddd, MMMM D'); // Format delivery date as a string

            // Generate HTML for the current cart item
            cartSummaryHTML += `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                        Delivery date: ${dateString}
                    </div>
                    <div class="cart-item-details-grid">
                        <img class="product-image" src="${matchingProduct.image}">
                        <div class="cart-item-details">
                            <div class="product-name">
                                ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                                ${matchingProduct.getPrice()}
                            </div>
                            <div class="product-quantity">
                                <span>
                                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                                </span>
                                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                                    Update
                                </span>
                                <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" value="${cartItem.quantity}" style="display:none;">
                                <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}" style="display:none;">
                                    Save
                                </span>
                                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                                    Delete
                                </span>
                            </div>
                        </div>
                        <div class="delivery-options">
                            <div class="delivery-options-title">
                                Choose a delivery option:
                            </div>
                            ${deliveryOptionsHTML(matchingProduct, cartItem)}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Function to generate HTML for delivery options
    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';
        // Iterate over each delivery option
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs(); // Get the current date
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate delivery date
            const dateString = deliveryDate.format('dddd, MMMM D'); // Format delivery date as a string
            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `${formatCurrency(deliveryOption.priceCents)} -`; // Format delivery price
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId; // Check if this delivery option is selected

            // Generate HTML for the current delivery option
            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `;
        });

        return html; // Return the generated HTML for delivery options
    }

    // Display the generated HTML for the order summary on the webpage
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    // Attach event listeners to interactive elements if cart is not empty
    if (cart.length > 0) {
        // Event listener for 'Delete' links
        document.querySelectorAll('.js-delete-link').forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId); // Remove the item from the cart
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.remove(); // Remove the HTML container for the item
                renderOrderSummary(); // Re-render the order summary
                renderPaymentSummary(); // Re-render the payment summary
                updateHeaderItemCount(); // Update the header item count
            });
        });

        // Event listener for selecting delivery options
        document.querySelectorAll('.js-delivery-option').forEach((element) => {
            element.addEventListener('click', () => {
                const { productId, deliveryOptionId } = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId); // Update the delivery option for the item
                renderOrderSummary(); // Re-render the order summary
                renderPaymentSummary(); // Re-render the payment summary
                updateHeaderItemCount(); // Update the header item count
            });
        });

        // Event listener for 'Update' links to update quantity
        document.querySelectorAll('.js-update-link').forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const input = document.querySelector(`.js-quantity-input-${productId}`);
                const saveLink = document.querySelector(`.js-save-link[data-product-id="${productId}"]`);
                input.style.display = 'inline'; // Show the quantity input field
                saveLink.style.display = 'inline'; // Show the 'Save' link
                link.style.display = 'none'; // Hide the 'Update' link
            });
        });

        // Event listener for 'Save' links to save updated quantity
        document.querySelectorAll('.js-save-link').forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const input = document.querySelector(`.js-quantity-input-${productId}`);
                const quantity = parseInt(input.value, 10); // Get the updated quantity
                updateQuantityInCart(productId, quantity); // Update the quantity in the cart
                renderOrderSummary(); // Re-render the order summary
                renderPaymentSummary(); // Re-render the payment summary
                updateHeaderItemCount(); // Update the header item count
            });
        });
    }
}

// Function to update the header item count
function updateHeaderItemCount() {
    const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const itemCountElement = document.querySelector('.checkout-header-middle-section .return-to-home-link');
    itemCountElement.textContent = `${totalItems} items`; // Update the header item count text
}
