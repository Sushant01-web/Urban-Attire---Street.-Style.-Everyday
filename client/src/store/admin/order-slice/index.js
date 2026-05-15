/*--------------------------------------
Creating a slice to manage state of User's Orders in Admin View
---------------------------------------*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";


const initialState = {
    orderList : [],
    orderDetails : null
}


//CReating Asyncthunk for user's all Order .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const getAllOrdersForAdmin = createAsyncThunk('/order/getAllOrdersForAdmin', async () => {
    const response = await axios.get(`http://localhost:5000/api/admin/orders/get`)

    return response.data
})


//CReating Asyncthunk for user's Order's details .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const getOrderDetailsForAdmin = createAsyncThunk('/order/getOrderDetailsForAdmin', async (id) => {
    const response = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`)

    return response.data
})


//CReating Asyncthunk for user's Order's update .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const updateOrderStatus = createAsyncThunk('/order/updateOrderStatus', async({id, orderStatus})=>{
    const response = await axios.put(`http://localhost:5000/api/admin/orders/update/${id}`,{orderStatus})

    return response.data
})

const AdminOrderSlice = createSlice({
    name : "adminOrders",
    initialState,
    reducers : {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
    },
    extraReducers : (builder)=>{
        builder.addCase(getAllOrdersForAdmin.pending, (state) => {
                    state.isLoading = true;
                }).addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderList = action.payload.data;
                }).addCase(getAllOrdersForAdmin.rejected, (state) => {
                    state.isLoading = false;
                    state.orderList = [];
                }).addCase(getOrderDetailsForAdmin.pending, (state) => {
                    state.isLoading = true;
                }).addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderDetails = action.payload.data;
                }).addCase(getOrderDetailsForAdmin.rejected, (state) => {
                    state.isLoading = false;
                    state.orderDetails = null;
                });
    }
})

export const {resetOrderDetails} = AdminOrderSlice.actions

export default AdminOrderSlice.reducer


