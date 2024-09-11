import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    isLoading : false,
    reviews : [],
}


export const addReview = createAsyncThunk("/shop/addReview",async(data)=>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`,data)

    return response.data
})

export const getReviews = createAsyncThunk("/shop/getReviews",async(id)=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${id}`)

    return response.data
})

const reviewSlice = createSlice({
    name : "reviewSlice",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(getReviews.pending,(state) => {
            state.isLoading = true
        })
        .addCase(getReviews.fulfilled,(state,action) => {
            state.isLoading = false
            state.reviews = action.payload.data
        })
        .addCase(getReviews.rejected,(state) => {
            state.isLoading = false
        })
    }
})


export default reviewSlice.reducer;