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
            
            // Create a unique key for the item (product + variant)
            const itemKey = newItem.attributeId ? `${newItem.id}_${newItem.attributeId}` : newItem.id;
            
            const existingItem = state.products.find((item) => {
                const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                return existingKey === itemKey;
            });

            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice += (newItem.price || newItem.basePrice) * (newItem.quantity || 1);
            } else {
                state.products.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price || newItem.basePrice,
                    quantity: newItem.quantity || 1,
                    totalPrice: (newItem.price || newItem.basePrice) * (newItem.quantity || 1),
                    image: newItem.image,
                    attributeId: newItem.attributeId || null,
                    // Store variant info for display
                    variantInfo: newItem.attributeId ? {
                        color: newItem.selectedColor,
                        size: newItem.selectedSize
                    } : null
                });
            }
            
            const itemPrice = newItem.price || newItem.basePrice;
            const itemQuantity = newItem.quantity || 1;
            state.totalPrice += itemPrice * itemQuantity;
            state.totalQuantity += itemQuantity;

            saveCartToStorage(state);
            toast.success(`${newItem.name} added to cart!`);
        },

        removeFromCart: (state, action) => {
            const { id, attributeId } = action.payload;
            const itemKey = attributeId ? `${id}_${attributeId}` : id;
            
            const foundItem = state.products.find((item) => {
                const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                return existingKey === itemKey;
            });

            if (foundItem) {
                state.totalPrice -= foundItem.totalPrice;
                state.totalQuantity -= foundItem.quantity;
                state.products = state.products.filter((item) => {
                    const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                    return existingKey !== itemKey;
                });
            }

            saveCartToStorage(state);
            toast.error(`Product removed from cart.`);
        },

        increaseQuantity: (state, action) => {
            const { id, attributeId } = action.payload;
            const itemKey = attributeId ? `${id}_${attributeId}` : id;
            
            const foundItem = state.products.find((item) => {
                const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                return existingKey === itemKey;
            });
            
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
            const { id, attributeId } = action.payload;
            const itemKey = attributeId ? `${id}_${attributeId}` : id;
            
            const foundItem = state.products.find((item) => {
                const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                return existingKey === itemKey;
            });
            
            if (foundItem) {
                foundItem.quantity--;
                foundItem.totalPrice -= foundItem.price;
                state.totalQuantity--;
                state.totalPrice -= foundItem.price;

                // Remove if quantity is 0
                if (foundItem.quantity === 0) {
                    state.products = state.products.filter((item) => {
                        const existingKey = item.attributeId ? `${item.id}_${item.attributeId}` : item.id;
                        return existingKey !== itemKey;
                    });
                }
            }

            saveCartToStorage(state); 
        }
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;