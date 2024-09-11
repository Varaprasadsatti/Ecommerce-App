import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const initialState = {
    approvalUrl : null,
    isLoading : false,
    orderId : null,
    orderList : [],
    orderDetails : null
}

export const createNewOrder = createAsyncThunk("/order/createNewOrder",async(orderData)=>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`,orderData)

    return response.data
})

export const capturePayment = createAsyncThunk("/order/capturePayment",async({orderId,paymentId,payerId})=>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/capture`,{orderId,paymentId,payerId})

    return response.data
})

export const getAllOrdersByUserId = createAsyncThunk("/order/getAllOrdersByUserId",async(userId)=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`)

    return response.data
})
export const getOrderDetails = createAsyncThunk("/order/getOrderDetails",async(id)=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`)

    return response.data
})

const shoppingOrderSlice = createSlice({
    name:"shoppinOrderSlice",
    initialState,
    reducers : {
        resetOrderDetails : (state,action)=>{
            state.orderDetails = null
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(createNewOrder.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(createNewOrder.fulfilled,(state,action)=>{
            state.isLoading = false
            state.approvalUrl = action.payload.approvalUrl
            state.orderId = action.payload.orderId
            
            sessionStorage.setItem("currentOrderId",JSON.stringify(action.payload.orderId))
        })
        .addCase(createNewOrder.rejected,(state)=>{
            state.isLoading = false
            state.approvalUrl = null
            state.orderId = null
        })
        .addCase(getAllOrdersByUserId.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getAllOrdersByUserId.fulfilled,(state,action)=>{
            state.isLoading = false
            state.orderList = action.payload.data
    
        })
        .addCase(getAllOrdersByUserId.rejected,(state)=>{
            state.isLoading = false
        })
        .addCase(getOrderDetails.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getOrderDetails.fulfilled,(state,action)=>{
            state.isLoading = false
            state.orderDetails = action.payload.data
    
        })
        .addCase(getOrderDetails.rejected,(state)=>{
            state.isLoading = false
        })
    }
});


export const {resetOrderDetails} = shoppingOrderSlice.actions
export default shoppingOrderSlice.reducer;