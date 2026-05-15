//creating slices for main store

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"


//Importing AdminProductSlice
import adminProductsSlice from "./admin/product-slice"

//Importing AdminOrderSlice
import adminOrderSlice from "./admin/order-slice"

//Importing FeatureImage Slice
import featureImagesSlice from "./common"

//Importing ShoppingProductSlice
import shopProductSlice from "./shop/product-slice"

//Impoting shoppingCartProduct
import shopCartSlice from './shop/cart-slice'

//Importing addressSlice
import shopAddressSlice from "./shop/address-slice"

//Importing orderSlice
import shopOrderSlice from "./shop/order-slice"

//importing searchSlice
import searchProductSlice from "./shop/search-slice"

//Importing reviewSlice
import reviewProductSlice from "./shop/review-slice"

const store = configureStore({
    reducer: {
        auth: authReducer,

        //Admin Products slice
        adminProducts: adminProductsSlice,

        //Admin Orders Slice
        adminOrders : adminOrderSlice,

        //Feature Images Slice
        featureImages : featureImagesSlice,

        //Shopping product slice
        shopProducts: shopProductSlice,

        //Cart Product Slice
        shopCart: shopCartSlice,

        //Address Slice
        shopAddress: shopAddressSlice,

        //Order Slice
        shopOrder : shopOrderSlice,

        //search slice
        searchProduct : searchProductSlice,

        //review Slice
        reviewProduct : reviewProductSlice,
    }
})

export default store

