/*------------------------------
Creating a model to add reviews to products
-------------------------------*/
const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    productId : String,
    userId : String,
    username : String,
    reviewMessage : String,
    reviewValue : Number
}, {timestamps : true})

module.exports = mongoose.model("ProductReview", ReviewSchema)