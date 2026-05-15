/*---------------------------------------
Creating controller to get images or products
----------------------------------------*/

//Getting products type from models/product.js
const Product = require("../../models/product.model")


const getFilteredProducts = async (req, res) => {
    try {

        //Getting Category and Brand from our query// which is build in frontend - pages/shps/listing
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query

        let filters = {}

        //Disjoing category with (&) and making it simple string
        if (category.length) {
            filters.category = { $in: category.split(',') }
        }

        //Disjoing brand with (&) and making it simple string
        if (brand.length) {
            filters.brand = { $in: brand.split(',') }
        }

        //Sorting products
        let sort = {}

        switch (sortBy) {
            //Case 1 - Sorting Low price to high price
            case 'price-lowtohigh':
                sort.price = 1
                break;

            //Case 2 - Sorting high price to low price
            case 'price-hightolow':
                sort.price = -1
                break;

            //Case 3 - Sorting from a to z
            case 'title-atoz':
                sort.title = 1
                break;

            //Case 4 - sorting from z- a
            case 'title-ztoa':
                sort.title = -1
                break;

            default:
                break;
        }


        //Here we get all the products
        const products = await Product.find(filters).sort(sort)

        res.status(200).json({
            success: true,
            data: products
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}

/*---------------------
Creating Function to getting details of products -- this will get id from database
---------------------*/

const getProductsDetails = async (req, res) => {
    try {

        //Getting Params
        const { id } = req.params

        //Finding product by id
        const product = await Product.findById(id)


        //if product is not present
        if (!product) return res.status(404).json({
            success: false,
            message: "Product Not Found"
        })

        //if product is present
        res.status(200).json({
            success: true,
            data: product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}

module.exports = { getFilteredProducts, getProductsDetails }