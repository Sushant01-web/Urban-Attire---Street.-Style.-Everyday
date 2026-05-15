/*-------------------------------
Creating slice to manage state of banner images
-------------------------------- */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading : false,
    featureImageList : []
}

//Adding feature images
export const addFeatureImages = createAsyncThunk('/order/addFeatureImages', async(image)=>{
    const response = await axios.post(`http://localhost:5000/api/common/feature/add`, {image})

    return response.data
})

//Getting all feature images
export const getFeatureImages = createAsyncThunk('/order/getFeatureImages', async()=>{
    const response = await axios.get("http://localhost:5000/api/common/feature/get")

    return response.data
})

const featureImage = createSlice({
    name: "featureImage",
    initialState,
    reducers: {},
    extraReducers : (builder)=>{
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
    }
})

export default featureImage.reducer