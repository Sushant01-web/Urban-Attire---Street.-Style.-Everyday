/*------------------------------
Writing a controller to search the products based on their names
-------------------------------*/
const Product = require("../../models/product.model")

const searchProducts = async(req, res)=>{
    try {
        //According to user input,, we will get it from params
        const {keyword} = req.params

        //if keyword present nahi hai yaa, keyword string nhi hai toh error de do
        if(!keyword || typeof keyword !== "string"){
            return res.status(404).json({
                success : false,
                message : "Keyword is required and must be a string"
            })
        }

        //Use of RegEx - agar user koi bhi keyword type krta hai toh,, us keyword se match hone wale products display kra do
        const regEx = new RegExp(keyword, "i")

        //creating a query to search products
        const createSearchQuery = {
            $or: [
                {title : regEx},
                {description : regEx},
                {brand : regEx},
                {category : regEx}
            ]
        }

        const searchResult = await Product.find(createSearchQuery)

        res.status(200).json({
            success : true,
            data : searchResult
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
}

module.exports = {searchProducts}