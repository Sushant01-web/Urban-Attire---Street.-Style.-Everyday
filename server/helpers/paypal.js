/*--------------------------------------
Writing a Code and Logic to Handle our Payment Gateway
----------------------------------------*/
const paypal = require("paypal-rest-sdk")

paypal.configure({
    mode: process.env.MODE,
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
})

module.exports = paypal