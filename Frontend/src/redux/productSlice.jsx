import { createSlice } from "@reduxjs/toolkit";
import { mockData } from "../assets/mockData.jsx";
const initialState = {
    products: [],
    searchTerm: '',
    filteredData: [],
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.filteredData = state.products.filter(product =>
                product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
            );
        },
    }
})

export const fetchProducts = () => async (dispatch) => {
    dispatch(setProducts(mockData));
};
export const { setProducts, setSearchTerm } = productSlice.actions;
export default productSlice.reducer;