//Creating Slice here to Manage States of Products
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

//Giving Initia state to these products
const initialState = {
    isLoading: false,
    productList: []
}


//CReating Asyncthunk for add product .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const addNewProduct = createAsyncThunk('/products/addnewproduct', async (formdata) => {
    const result = await axios.post("http://localhost:5000/api/admin/products/add", formdata, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    return result?.data

})


//CReating Asyncthunk to fetchAllProducts .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts', async () => {

    //this will be get method because we are fetching products
    const result = await axios.get("http://localhost:5000/api/admin/products/get")
    return result?.data
})


//CReating Asyncthunk to edit products .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const editProduct = createAsyncThunk('/products/editProduct', async ({ id, formData }) => {

    const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`, formData, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return result?.data
})



//CReating Asyncthunk to delete products .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const deleteProduct = createAsyncThunk('/products/deleteProduct', async (id) => {
    const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`)
    return result?.data

})



const AdminProductsSlice = createSlice({
    name: 'adminProduct',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false
            //adding data to product list
            state.productList = action.payload.data
            console.log(action.payload)
        }).addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false
            state.productList - []
        })
    }
})

//Exporting Reducer
export default AdminProductsSlice.reducer

