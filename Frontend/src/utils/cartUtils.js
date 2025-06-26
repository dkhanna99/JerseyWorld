import { API_ENDPOINTS } from '../config.js';

// Flag to prevent duplicate cart initialization
let cartInitialized = false;

// Dispatch cart update event
const dispatchCartUpdateEvent = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
};

// Generate a unique cart ID
export const generateCartId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `cart_${timestamp}_${random}`;
};

// Initialize a new cart
export const initializeCart = async () => {
    try {
        const cartId = generateCartId();
        
        const response = await fetch(API_ENDPOINTS.CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartId: cartId,
                items: []
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create cart');
        }

        const cart = await response.json();
        
        // Store cartId in localStorage
        localStorage.setItem('cartId', cartId);
        cartInitialized = true;
        
        return cart;
    } catch (error) {
        console.error('Error initializing cart:', error);
        throw error;
    }
};

// Get cart ID from localStorage or create new one
export const getOrCreateCartId = () => {
    let cartId = localStorage.getItem('cartId');
    
    if (!cartId) {
        cartId = generateCartId();
        localStorage.setItem('cartId', cartId);
    }
    
    return cartId;
};

// Get existing cart from API
export const getCart = async (cartId) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.CART}/${cartId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                // Cart doesn't exist, create a new one
                return await initializeCart();
            }
            throw new Error('Failed to fetch cart');
        }
        
        cartInitialized = true;
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

// Initialize cart only once
export const initializeCartOnce = async () => {
    if (cartInitialized) {
        const cartId = localStorage.getItem('cartId');
        if (cartId) {
            console.log('Cart already initialized with ID:', cartId);
            return { cartId };
        }
    }
    
    const cartId = getOrCreateCartId();
    const cart = await getCart(cartId);
    return cart;
};

// Add product to cart
export const addProductToCart = async (product, quantity = 1) => {
    try {
        const cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            throw new Error('No cart ID found. Please refresh the page.');
        }

        console.log('Adding product:', product.name, 'ID:', product.id, 'to cart:', cartId);

        // Get current cart
        const currentCart = await getCart(cartId);
        console.log('Current cart items:', currentCart.items);
        
        // Check if product already exists in cart
        const existingItemIndex = currentCart.items.findIndex(item => {
            const itemProductId = typeof item.productId === 'object' ? item.productId._id || item.productId.id : item.productId;
            return itemProductId === product.id;
        });

        console.log('Existing item index:', existingItemIndex);

        let updatedItems;
        if (existingItemIndex !== -1) {
            // Update existing item quantity
            updatedItems = [...currentCart.items];
            updatedItems[existingItemIndex].quantity += quantity;
            console.log('Updated existing item quantity to:', updatedItems[existingItemIndex].quantity);
        } else {
            // Add new item
            updatedItems = [
                ...currentCart.items,
                {
                    productId: product.id,
                    quantity: quantity,
                    price: product.price
                }
            ];
            console.log('Added new item with quantity:', quantity);
        }

        console.log('Updated items:', updatedItems);

        // Update cart in backend
        const response = await fetch(API_ENDPOINTS.CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartId: cartId,
                items: updatedItems
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const updatedCart = await response.json();
        console.log('Product added to cart:', product.name, 'Updated cart:', updatedCart);
        
        // Dispatch cart update event
        dispatchCartUpdateEvent();
        
        return updatedCart;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
};

// Remove product from cart
export const removeProductFromCart = async (productId) => {
    try {
        const cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            throw new Error('No cart ID found. Please refresh the page.');
        }

        console.log('Removing product from cart - Product ID:', productId, 'Cart ID:', cartId);

        // Get current cart
        const currentCart = await getCart(cartId);
        console.log('Current cart before removal:', currentCart);
        
        // Remove the item
        const updatedItems = currentCart.items.filter(item => {
            const itemProductId = typeof item.productId === 'object' ? item.productId._id || item.productId.id : item.productId;
            const shouldKeep = itemProductId !== productId;
            console.log('Checking item:', itemProductId, 'against:', productId, 'Keep:', shouldKeep);
            return shouldKeep;
        });

        console.log('Updated items after removal:', updatedItems);

        // Update cart in backend
        const response = await fetch(API_ENDPOINTS.CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartId: cartId,
                items: updatedItems
            })
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }

        const updatedCart = await response.json();
        console.log('Product removed from cart, updated cart:', updatedCart);
        
        // Dispatch cart update event
        dispatchCartUpdateEvent();
        
        return updatedCart;
    } catch (error) {
        console.error('Error removing product from cart:', error);
        throw error;
    }
};

// Update product quantity in cart
export const updateProductQuantity = async (productId, newQuantity) => {
    try {
        const cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            throw new Error('No cart ID found. Please refresh the page.');
        }

        console.log('Updating quantity for product:', productId, 'to:', newQuantity);

        // Get current cart
        const currentCart = await getCart(cartId);
        console.log('Current cart before update:', currentCart);
        
        // Update the item quantity
        const updatedItems = currentCart.items.map(item => {
            const itemProductId = typeof item.productId === 'object' ? item.productId._id || item.productId.id : item.productId;
            if (itemProductId === productId) {
                console.log('Found item to update, changing quantity from', item.quantity, 'to', newQuantity);
                return { ...item, quantity: Math.max(1, newQuantity) }; // Ensure quantity is at least 1
            }
            return item;
        });

        console.log('Updated items:', updatedItems);

        // Update cart in backend
        const response = await fetch(API_ENDPOINTS.CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartId: cartId,
                items: updatedItems
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update product quantity');
        }

        const updatedCart = await response.json();
        console.log('Product quantity updated, new cart:', updatedCart);
        
        // Dispatch cart update event
        dispatchCartUpdateEvent();
        
        return updatedCart;
    } catch (error) {
        console.error('Error updating product quantity:', error);
        throw error;
    }
};

// Get cart with populated product details
export const getCartWithProducts = async () => {
    try {
        const cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            throw new Error('No cart ID found. Please refresh the page.');
        }

        const cart = await getCart(cartId);
        
        // Transform the cart items to use the product data that's already included
        const itemsWithProducts = cart.items.map((item) => ({
            ...item,
            product: {
                id: item.productId._id || item.productId,
                name: item.productId.name,
                image: item.productId.image && item.productId.image.length > 0 ? item.productId.image[0] : '',
                price: item.productId.price,
                description: item.productId.description
            }
        }));

        return {
            ...cart,
            items: itemsWithProducts
        };
    } catch (error) {
        console.error('Error getting cart with products:', error);
        throw error;
    }
}; 