/*--------------------------------------
Creating a slice to manage state of User's Address
---------------------------------------*/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Creating Initial State for Address
const initialState = {
  isLoading: false,
  addressList: []
}

/*--------------------------------------
Need to Create 4 Async Thunk Such as for (addAddress, fetchAddress, editAddress and deleteAddress)
---------------------------------------*/

//CReating Asyncthunk for addAddress .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const addNewAddress = createAsyncThunk('/addAddresses/addNewAddress', async (formData) => {
  const response = await axios.post("http://localhost:5000/api/shop/address/add", formData)

  return response.data
})


//CReating Asyncthunk for fetch Address .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const fetchAddresses = createAsyncThunk('/addAddresses/fetchAddresses', async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/shop/address/get/${userId}`)

  return response.data
})


//CReating Asyncthunk for edit Address .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const editAddress = createAsyncThunk('/addAddresses/editAddress', async ({ userId, addressId, formData }) => {
  const response = await axios.put(`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`, formData)

  return response.data
})


//CReating Asyncthunk for delet Address .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const deleteAddress = createAsyncThunk('/addAddresses/deleteAddress', async ({ userId, addressId }) => {
  const response = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`)

  return response.data
})


const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  }
})


export default addressSlice.reducer;
