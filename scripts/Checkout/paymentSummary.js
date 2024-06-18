import { cart, getTotalItemsInCart, addToCart, removeFromCart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeilveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let totalItems = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;
        totalItems += cartItem.quantity;

        const deliveryOption = getDeilveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

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

        <button class="button-primary complete-order-button">Complete Order</button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}


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

function generateOrderId() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function clearCart() {
    while (cart.length > 0) {
        cart.pop();
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}
