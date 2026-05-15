const { imageUploadUtil } = require("../../helpers/cloudinary");
const productModel = require("../../models/product.model");

//Creating controller for image upload -- when its uploaded on frontent - it should be go on our server first then cloudinary
const handleImageUpload = async (req, res) => {
    try {
        //Converting Image into bytecode i.e buffer value
        const bufferedImage = Buffer.from(req.file.buffer).toString("base64");

        //once buffer done it will get url.. nd that url will handle data
        const url = "data:" + req.file.mimetype + ";base64," + bufferedImage;

        //Imported imageUploadedUtil function from (helper/cloudinary)
        const result = await imageUploadUtil(url);

        res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error Occured"
        })
    }
};


//Creating New Controller for adding new products
const addProduct = async (req, res) => {
    try {
        //Getting form data from front-end
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body

        //Creating New Product withschema set in model/products
        const newlyCreatedProducts = new productModel({
            image, title, description, category, brand, price, salePrice, totalStock
        })

        //Saving new Products to database
        await newlyCreatedProducts.save()
        res.status(201).json({
            success: true,
            data: newlyCreatedProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}



//Creating controller for fetching all products
const fetchAllProducts = async (req, res) => {
    try {
        //Fetching products from database
        const listOfProducts = await productModel.find({})
        res.status(200).json({
            success: true,
            data: listOfProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}




//Creating controller for editing products
const editProduct = async (req, res) => {
    try {
        /*
        We have to edit products by their id which is created by database.
        --First need to check if that products is exist or not... if not then return error as product cannot be found
        --If products is present then we can edit its information
        */
        const { id } = req.params

        //Getting all data from body of form
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body

        //Finding product by their mongoDb id
        let findProduct = await productModel.findById(id)

        //If products is not present
        if (!findProduct) return res.status(404).json({
            success: false,
            message: "Product Not Found"
        })

        //If Product is present then create editing
        findProduct.title = title || findProduct.title
        findProduct.description = description || findProduct.description
        findProduct.category = category || findProduct.category
        findProduct.brand = brand || findProduct.brand
        findProduct.price = price === '' ? 0 : price || findProduct.price
        findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice
        findProduct.totalStock = totalStock || findProduct.totalStock
        findProduct.image = image || findProduct.image

        await findProduct.save()
        res.status(200).json({
            success: true,
            data: findProduct,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}



//Creating controller for delete products
const deleteProduct = async (req, res) => {
    try {
        //Deleteing Products by their id.. first get that mongodb id and then delete
        const { id } = req.params
        const product = await productModel.findByIdAndDelete(id)

        //Check if product is not present
        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}

//Passing all controller
module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct }