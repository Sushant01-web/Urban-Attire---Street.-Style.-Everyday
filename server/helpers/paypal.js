/*--------------------------------------
Writing a Code and Logic to Handle our Payment Gateway
----------------------------------------*/
const paypal = require("paypal-rest-sdk")

paypal.configure({
    mode: 'sandbox',
    client_id : "AdCOXZykshHfOGBGOW-veG-Zcwivj8w9d_PIdSdTLHfcXYUQlJkm3EzgZ0LcXgVj8OJcanbgLcChbtOa",
    client_secret : "EOtQrnOlbAyzp2wtG5irjLvwsfvU-G5T2tXolSOLCcFg7enpY8yncSt_f823Zr_0mDx0lBEbr5ggBkXZ"
})

module.exports = paypal