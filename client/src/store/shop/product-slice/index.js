//Creating Slice here to Manage States of Products for Shopping pages

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

//Creating Initial State
const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}


//CReating Asyncthunk to fetchAllProducts .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllProducts', async ({ filterParams, sortParams }) => {

    //Creating a query
    const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams
    })

    //this will be get method because we are fetching products 
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`)
    return result?.data
})



/*-------------------------
Creating asyncthunk to fetching product details -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
 -------------------------*/
export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', async (id) => {

    //this will be get method because we are fetching products 
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`)
    return result?.data
})




const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
        setProductDetails : (state) => {
            state.productDetails = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
            state.isLoading = true
        }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            state.isLoading = false
            //here if image fetching is successfully done.. then it will add into productlist
            state.productList = action.payload.data
        }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productList = []
        })
            /*---------------------
            Adding cases for productdetails
            -----------------------*/
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true
            }).addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.productDetails = action.payload.data
            }).addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false
                state.productDetails = null;
            })
    }
})

//This is not automatically reopen the dialog product box when we come back to that
export const {setProductDetails} = shoppingProductSlice.actions

export default shoppingProductSlice.reducer;
