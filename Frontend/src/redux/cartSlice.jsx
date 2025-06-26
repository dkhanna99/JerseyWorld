import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

// Local Storage 
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');
        if (serializedCart) {
            const loadedCart = JSON.parse(serializedCart);

            // Sanitize bad data
            return {
                products: loadedCart.products || [],
                totalQuantity: Math.max(0, loadedCart.totalQuantity || 0),
                totalPrice: Math.max(0, loadedCart.totalPrice || 0),  // Prevent negative price
            };
        }
        return {
            products: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    } catch (error) {
        console.error("Could not load cart from localStorage", error);
        return {
            products: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }
};

const saveCartToStorage = (cart) => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem('cart', serializedCart);
    } catch (error) {
        console.error("Could not save cart to localStorage", error);
    }
};

// Initial State
const initialState = loadCartFromStorage();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.products.find((item) => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
                existingItem.totalPrice += newItem.price * newItem.quantity;
            } else {
                state.products.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: newItem.quantity,
                    totalPrice: newItem.price * newItem.quantity,
                    image: newItem.image,
                });
            }
            state.totalPrice += newItem.price * newItem.quantity;
            state.totalQuantity += newItem.quantity;

            saveCartToStorage(state);
            toast.success(`${newItem.name} added to cart!`);
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            const foundItem = state.products.find((item) => item.id === id);

            if (foundItem) {
                state.totalPrice -= foundItem.totalPrice;
                state.totalQuantity -= foundItem.quantity;
                state.products = state.products.filter((item) => item.id !== id);
            }

            saveCartToStorage(state);
            toast.error(`Product removed from cart.`);
        },

        increaseQuantity: (state, action) => {
            const id = action.payload;
            const foundItem = state.products.find((item) => item.id === id);
            if (foundItem) {
                foundItem.quantity++;
                foundItem.totalPrice += foundItem.price;
                state.totalQuantity++;
                state.totalPrice += foundItem.price;
            }

            saveCartToStorage(state); 
        },
        
        clearCart: (state) => {
            state.products = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            saveCartToStorage(state);
            toast.info("Cart cleared after order.");
        },
        
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const foundItem = state.products.find((item) => item.id === id);
            if (foundItem) {
                foundItem.quantity--;
                foundItem.totalPrice -= foundItem.price;
                state.totalQuantity--;
                state.totalPrice -= foundItem.price;

                // Remove if quantity is 0
                if (foundItem.quantity === 0) {
                    state.products = state.products.filter((item) => item.id !== id);
                }
            }

            saveCartToStorage(state); 
        }
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;