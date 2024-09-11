import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
    cartItems : [],
    isLoading : false
}


export const addToCart = createAsyncThunk("cart/addToCart",async ({userId,productId,quantity})=>{
    const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`,{
        userId,productId,quantity
    })

    return result.data
})

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems",async (userId)=>{
    
    
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`)
    return result.data
})

export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity",async ({userId,productId,quantity})=>{
    const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,{
        userId,productId,quantity
    })

    return result.data
})

export const deleteFromCart = createAsyncThunk("cart/deleteFromCart",async ({userId,productId})=>{
    const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`)

    return result.data
})


const ShoppingCartSlice = createSlice({
    name : "ShoppingCart",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(addToCart.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(addToCart.rejected,(state)=>{
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(fetchCartItems.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(fetchCartItems.fulfilled,(state,action)=>{
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(fetchCartItems.rejected,(state)=>{
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(updateCartQuantity.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(updateCartQuantity.fulfilled,(state,action)=>{
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(updateCartQuantity.rejected,(state)=>{
            state.isLoading = false
            state.cartItems = []
        })
        .addCase(deleteFromCart.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteFromCart.fulfilled,(state,action)=>{
            state.isLoading = false
            state.cartItems = action.payload.data
        })
        .addCase(deleteFromCart.rejected,(state)=>{
            state.isLoading = false
            state.cartItems = []
        })
    }
})

export default ShoppingCartSlice.reducer