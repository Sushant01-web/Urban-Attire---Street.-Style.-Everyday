/*--------------------------------------
Creating a slice to manage state of Cart's Produts
---------------------------------------*/

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



//Creating Initial State for Cart's items
const initialState = {
    cartItems: [],
    isLoading: false
}


/*--------------------------------------
Need to Create 4 Async Thunk Such as for (Addproduct, Fetchproduct, UpdateProduct and DeleteProduct)
---------------------------------------*/

//CReating Asyncthunk to add product to cart .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, productId, quantity }) => {


    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`, {
        userId, productId, quantity
    })
    return response.data
})


//CReating Asyncthunk to fetch product from cart .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (userId) => {


    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`)
    return response.data
})



//CReating Asyncthunk to delete product of cart .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)



//CReating Asyncthunk to update quanityt product of cart .. used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ userId, productId, quantity }) => {


    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
        {
            userId, productId, quantity
        }
    )
    return response.data
})



const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        /* Adding Case for addTocart Asyncthunk */
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true
        }).addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false
        }).addCase(addToCart.rejected, (state) => {
            state.isLoading = false
            state.cartItems = []
        })

            /* Adding Case for fetchcart items Asyncthunk */
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true
            }).addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false
                state.cartItems = action.payload.data
            }).addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false
                state.cartItems = []
            })

            /* Adding Case for updateQuantity in cart Asyncthunk */
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data
            })
            .addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })

            /* Adding Case for delete cart items Asyncthunk */
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
            })
    }
})

export default shoppingCartSlice.reducer;


