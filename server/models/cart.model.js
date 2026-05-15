/*-----------------------------
Creating Models for adding product in cart
------------------------------*/

const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    //Getting Userid -- who is adding product to car
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    //Which item user is adding to cart
    items: [
        {
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("Cart", CartSchema)

