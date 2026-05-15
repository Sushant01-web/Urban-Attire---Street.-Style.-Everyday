const express = require('express')
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRouter = require("./routes/auth/auth-routes")

require('dotenv').config()

//Getting route for admin products
const AdminProductRouter = require("./routes/admin/product-route")

//Getting route for handling all orders of all users in Admin View
const AdminOrderRouter = require("./routes/admin/order-route")

//Getting router for handling banner images for website from admin view
const commonFeatureRouter = require("./routes/common/features-routes")

//Gettinf route for shopping view products
const shoppingProductRouter = require("./routes/shop/product-route")

//Getting route for shopping cart
const shoppingCartProduct = require("./routes/shop/cart-routes")

//Getting routes for user's address
const shoppingAddressRouter = require("./routes/shop/address-routes")

//Getting routes for user's orders
const shopOrderRouter = require("./routes/shop/order-routes")

//Getting routes for searching products
const searchProductRouter = require("./routes/shop/search-route")

//Getting routes for managing reviews of Products
const reviewProductsRouter = require("./routes/shop/review-routes")

mongoose.connect(process.env.MONGODB_URL).then(() => { console.log("Database Connected") }).catch((error) => { console.log(error) })

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  "http://localhost:5173",
  "https://urban-attiree.netlify.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked for origin: " + origin));
  },
  credentials: true,
}));

app.options("*", cors());

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRouter)

/*
Router aise kam krta hai -- api/admin pe jake AdminProductRouter (router file) me jo bhi end point likha hai vo hit ho jayega
*/
app.use('/api/admin/products', AdminProductRouter)

//ye route admin view me sab users ke sab orders ko handle karega
app.use('/api/admin/orders', AdminOrderRouter)

//ye route admin view se websites ke banner ko handle karega
app.use('/api/common/feature', commonFeatureRouter)

//ye route shopping view ke products hadle kareg
app.use('/api/shop/products', shoppingProductRouter)

//ye route cart item ko handle karega
app.use('/api/shop/cart', shoppingCartProduct)

//ye route user address ko handle karege
app.use('/api/shop/address', shoppingAddressRouter)

//ye route user ke orders ko handle karege
app.use('/api/shop/order', shopOrderRouter)

//ye route products ko search karega
app.use('/api/shop/search', searchProductRouter)

//ye route products ke reviews ko handle karega
app.use('/api/shop/review', reviewProductsRouter)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
