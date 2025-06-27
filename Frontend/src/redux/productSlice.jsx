import { createSlice } from "@reduxjs/toolkit";

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
        },
        setFilteredData: (state, action) => {
            state.filteredData = action.payload;
        },
    }
})

export const { setProducts, setSearchTerm, setFilteredData } = productSlice.actions;
export default productSlice.reducer;