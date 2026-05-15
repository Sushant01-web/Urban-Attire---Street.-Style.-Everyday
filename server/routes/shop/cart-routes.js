/*-------------------------
Creating route for cart page -- Where product is added
--------------------------*/

const express = require("express")

//Getting Controller
const { addToCart, fetchCartItem, updateCartQuantity, deleteCartItem } = require("../../controllers/shop/cart-controller")

const router = express.Router()


//Creating routing endpoint for every controller
router.post('/add', addToCart)

router.get('/get/:userId', fetchCartItem) //-Fetching products by their id

router.put('/update-cart', updateCartQuantity) //-Update the product in cart

router.delete('/:userId/:productId', deleteCartItem) //-Delete product from cart

module.exports = router;
