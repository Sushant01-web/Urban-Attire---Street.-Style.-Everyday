/*--------------------------------------
Creating a slice to maintain state during and after search
----------------------------------------*/

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading : false,
    searchResult : []
}

/*-------------------------
Creating asyncthunk to search product -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
 -------------------------*/
export const getSearchResult = createAsyncThunk('/search/getSearchResult', async (keyword) => {

    //this will be get method because we are fetching products 
    const result = await axios.get(`http://localhost:5000/api/shop/search/${keyword}`)
    return result?.data
})


const searchSlice = createSlice({
    name : "searchSlice",
    initialState,
    reducers : {
        resetSearchResults: (state) => {
        state.searchResult = [];
    },
    },
    extraReducers : (builder)=>{
    builder.addCase(getSearchResult.pending, (state) => {
        state.isLoading = true;
      })
    .addCase(getSearchResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResult = action.payload.data;
      })
    .addCase(getSearchResult.rejected, (state) => {
        state.isLoading = false;
        state.searchResult = [];
      });
    }
})

export const {resetSearchResults} = searchSlice.actions

export default searchSlice.reducer