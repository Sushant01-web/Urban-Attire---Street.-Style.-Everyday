/*------------------------------------------
Creating a Routes for Order in shopping vieew
-------------------------------------------*/
const express = require("express")

const {createOrder, capturePayemnt, getAllOrdersByUser, getOrderDetails} = require ("../../controllers/shop/order.controller")

const router = express.Router()

router.post("/create", createOrder)
router.post('/capture', capturePayemnt)
router.get('/list/:userId', getAllOrdersByUser)
router.get('/details/:id', getOrderDetails)

module.exports = router