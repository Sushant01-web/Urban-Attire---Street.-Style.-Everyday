/*----------------------------------------
Creating Model for Address and Account Section of user
-----------------------------------------*/

const mongoose = require ("mongoose")

const AddressSchema = new mongoose.Schema({
    userId : String,
    address : String,
    city : String,
    pincode : String,
    phone : Number,
    notes : String,
}, {timestamps : true})

module.exports = mongoose.model("Address", AddressSchema)