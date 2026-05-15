// This route will hold all the shopping products information -- Creating routes for uploading files

const express = require("express")

//Getting Controller
const { getFilteredProducts, getProductsDetails } = require("../../controllers/shop/products-controller")

const router = express.Router()


//Creating router to get list of products
router.get('/get', getFilteredProducts)
router.get('/get/:id', getProductsDetails)



module.exports = router;