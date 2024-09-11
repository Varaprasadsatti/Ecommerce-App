import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
    isLoading : false,
    productsList : [],
    productDetails : null,
}

export const fetchAllFilteredProducts = createAsyncThunk("/products/fetchAllFilteredProducts",
    async ({filterParams,sortParams}) => {

        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams,
        });
        

        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`)

        return result?.data
    }
)

export const fetchProductDetails
 = createAsyncThunk("/products/fetchProductDetails",
    async (id) => {

        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`)

        return result?.data
    }
)

const ShoppingProductsSlice = createSlice({
    name : "shoppingProducts",
    initialState,
    reducers : {
        setProductDetails : (state,action)=>{
            state.productDetails = null
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllFilteredProducts.pending,(state,action)=>{
            state.isLoading = true
        })
        .addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
            state.isLoading = false
            state.productsList = action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
            state.isLoading = false
            state.productsList = []
        })
        .addCase(fetchProductDetails.pending,(state,action)=>{
            state.isLoading = true
        })
        .addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.isLoading = false
            state.productDetails = action.payload.data
        })
        .addCase(fetchProductDetails.rejected,(state,action)=>{
            state.isLoading = false
            state.productDetails = null
        })
    }
})

export const {setProductDetails} = ShoppingProductsSlice.actions

export default ShoppingProductsSlice.reducer