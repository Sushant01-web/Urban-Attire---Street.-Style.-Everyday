/*--------------------------------------
Creating a slice to manage the state for reviews of products
---------------------------------------*/

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState ={
    isLoading : false,
    reviews : []
}

/*-------------------------
Creating asyncthunk to add reviews of product -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
 -------------------------*/
export const addReview = createAsyncThunk('/review/addReview', async (formdata) => {

    //this will be get method because we are fetching products 
    const result = await axios.post(`http://localhost:5000/api/shop/review/add`, formdata)
    return result?.data
})


/*-------------------------
Creating asyncthunk to get reviews of product -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
 -------------------------*/
export const getReview = createAsyncThunk('/review/getReview', async (id) => {

    //this will be get method because we are fetching products 
    const result = await axios.get(`http://localhost:5000/api/shop/review/${id}`)
    return result?.data
})


const reviewSlice = createSlice({
    name : "reviewSlice",
    initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReview.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
    }
})

export default reviewSlice.reducer;