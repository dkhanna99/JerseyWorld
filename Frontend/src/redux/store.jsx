import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice.jsx";
import productSlice from "./productSlice.jsx";

const store = configureStore({
    reducer: {
        cart: cartSlice,
        products: productSlice,
    }
})

export default store;