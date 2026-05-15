/*--------------------------------------
Creating a slice to manage state of User's Orders
---------------------------------------*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Creating Initial State
const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null
}


//CReating Asyncthunk for user's order .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const createNewOrder = createAsyncThunk('/order/createNewOrder', async (orderData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`, orderData)

    return response.data
})


//CReating Asyncthunk for user's payment .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const capturePayemnt = createAsyncThunk('/order/capturePayemnt', async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/capture`, { paymentId, payerId, orderId })

    return response.data
})


//CReating Asyncthunk for user's all Order .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const getAllOrdersByUserId = createAsyncThunk('/order/getAllOrdersByUserId', async (userId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`)

    return response.data
})


//CReating Asyncthunk for user's Order's details .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const getOrderDetails = createAsyncThunk('/order/getOrderDetails', async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`)

    return response.data
})


const shoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null
        }
    },
    extraReducers: (buildlder) => {
        buildlder.addCase(createNewOrder.pending, (state) => {
            state.isLoading = true
        }).addCase(createNewOrder.fulfilled, (state, action) => {
            state.isLoading = false

            //Getting Approval Url and orderId from order-controller
            state.approvalURL = action.payload.approvalURL
            state.orderId = action.payload.orderId

            //Setting this orderId to fetch while payment
            sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId))
        }).addCase(createNewOrder.rejected, (state, action) => {
            state.isLoading = false
            state.approvalURL = null
            state.orderId = null
        }).addCase(getAllOrdersByUserId.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
        }).addCase(getAllOrdersByUserId.rejected, (state) => {
            state.isLoading = false;
            state.orderList = [];
        }).addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
        }).addCase(getOrderDetails.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null;
        });
    }
})


export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer
