/*--------------------------------
Creating a controller to add and manage reviews about products
----------------------------------*/
const Order = require("../../models/orders.model")
const ProductReview = require("../../models/review.model")
const Product = require("../../models/product.model")

//1. Add reviews about products
const addProductReview = async(req, res)=>{
    try {
        //Getting all the requirement as per the mongoose schema
        const {productId, userId, username, reviewMessage, reviewValue} = req.body

        /*Finding Order -- based on this we are able to review that ordered product
        Stric message -- we can add reviews to only already ordered products
        */
        const order = await Order.findOne({
            userId,
            "cartItems.productId" : productId,
            orderStatus : "confirmed" || "delivered"
        })

        if(!order){
            return res.status(403).json({
                success : false,
                message : "You need to purchase this product to review"
            })
        }

        //Checking if user has already review that purchased product -- because only one review can be add
        const checkExistingReview = await ProductReview.findOne({
            productId,
            userId
        })
        if(checkExistingReview){
            return res.status(400).json({
                success : false,
                message : "You already reviewed this product"
            })
        }

        //Setting new review to product
        const newReview = new ProductReview({
            productId,
            userId,
            username,
            reviewMessage,
            reviewValue
        })
        await newReview.save()

        //Calculating average reviews of particular product
        const reviews = await ProductReview.find({productId})
        const totalReviews = reviews.length
        const averageReviews = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0)/ totalReviews

        await Product.findByIdAndUpdate(productId, {averageReviews})

        res.status(200).json({
            success : true,
            message : "Review added succssfully",
            data : newReview
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}


//2. get reviews of products
const getProductReview = async(req, res)=>{
    try {
        //Getting reviews based on productId from params
        const {productId} = req.params;

        const reviews = await ProductReview.find({productId})

        res.status(200).json({
            success : true,
            data : reviews
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}

module.exports = {addProductReview, getProductReview}