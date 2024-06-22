// Import necessary functions and data from external modules
import { cart, getTotalItemsInCart, addToCart, removeFromCart } from './cart.js';
import { getProduct } from './products.js';
import { getDeilveryOption } from './deliveryOptions.js';
import { formatCurrency } from './money.js';

// Function to render the payment summary section on the webpage
export function renderPaymentSummary() {
    // Initialize variables to hold prices and total items
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let totalItems = 0;

    // Calculate product and shipping prices based on items in the cart
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;
        totalItems += cartItem.quantity;

        const deliveryOption = getDeilveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    // Calculate total before tax, tax, and total amount
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1; // Assuming 10% tax
    const totalCents = totalBeforeTaxCents + taxCents;

    // Generate HTML for payment summary section
    const paymentSummaryHTML = `
        <div class="payment-summary-title">Order Summary</div>

        <div class="payment-summary-row">
            <div>Items (${totalItems}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button id="place-order-button" class="place-order-button button-primary">Place your order</button>
    `;

    // Display the generated HTML for payment summary on the webpage
    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    // Event listener for 'Place Order' button
    document.getElementById('place-order-button').addEventListener('click', () => {
        // Save order details to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrder = { id: generateOrderId(), date: new Date(), items: [...cart] };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear the cart
        clearCart();

        // Redirect to orders page
        window.location.href = 'orders.html';
    });
}

// Function to generate a random order ID
function generateOrderId() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to clear the cart and update localStorage
function clearCart() {
    while (cart.length > 0) {
        cart.pop();
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}
