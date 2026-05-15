/*-------------------------
Creating route for Address -- Where Address is Add, edit, fetch and delete
--------------------------*/

const express = require ("express")

//Getting Controller
const {addAddress, editAddress, fetchAddress, deleteAddress} = require("../../controllers/shop/address.controller")

const router = express.Router()

//Creating routing endpoint for every address method
router.post('/add', addAddress)

router.get('/get/:userId', fetchAddress)

router.put('/update/:userId/:addressId', editAddress)

router.delete("/delete/:userId/:addressId", deleteAddress)

module.exports = router;
