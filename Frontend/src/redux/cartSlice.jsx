import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

// Local Storage 
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');
        return serializedCart ? JSON.parse(serializedCart) : {
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
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            } else {
                state.products.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    image: newItem.image,
                });
            }

            state.totalPrice += newItem.price;
            state.totalQuantity++;

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

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;