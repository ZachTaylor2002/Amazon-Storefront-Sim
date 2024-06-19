class Cart {
    // Declare class fields for cart items and local storage key
    cartItems;
    #localStorageKey;

    // Constructor takes a localStorage key as an argument
    constructor(localStorageKey) {
        // Initialize the localStorageKey field
        this.#localStorageKey = localStorageKey;
        // Load cart items from local storage
        this.#loadFromStorage();
    }

    // Private method to load cart items from local storage
    #loadFromStorage() {
        // Access global localStorage object and parse the stored JSON data
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

        // If there are no items in storage, initialize with default items
        if (!this.cartItems) {
            this.cartItems = [{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionId: '1'
            }, {
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionId: '2'
            }];
        }
    }

    // Method to save current cart items to local storage
    saveToStorage() {
        // Convert cartItems array to JSON string and save it in localStorage
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    // Method to add an item to the cart
    addToCart(productId) {
        let matchingItem;

        // Ensure cartItems is an array
        if (!Array.isArray(this.cartItems)) {
            this.cartItems = [];
        }

        // Check if the product is already in the cart
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        // If product is already in the cart, increment the quantity
        if (matchingItem) {
            matchingItem.quantity += 1;
        } else {
            // If product is not in the cart, add a new item
            this.cartItems.push({
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            });
        }

        // Save the updated cart to local storage
        this.saveToStorage();
    }

    // Method to remove an item from the cart
    removeFromCart(productId) {
        const newCart = [];

        // Filter out the item with the specified productId
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        });

        // Update cartItems with the filtered list
        this.cartItems = newCart;

        // Save the updated cart to local storage
        this.saveToStorage();
    }

    // Method to update the delivery option for a specific item
    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        // Find the item with the specified productId
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        // Update the delivery option
        matchingItem.deliveryOptionId = deliveryOptionId;

        // Save the updated cart to local storage
        this.saveToStorage();
    }
}

// Create instances of the Cart class with different local storage keys
const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

// Log the cart instances to the console
console.log(cart);
console.log(businessCart);
