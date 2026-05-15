/*------------------------
Basically we will have 4 controller
1 - Add to Cart
2 - Fetching all products from cart
3 - Delete products from cart
4 - Update quantity in that cart
-------------------------*/
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const mongoose = require("mongoose")



/*-----------------------
Writing Controller for Adding product to cart
------------------------*/
const addToCart = async (req, res) => {
    try {

        //Getting (userId, productId, quantity)
        const { userId, productId, quantity } = req.body
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data Provided"
            })
        }

        //Finding product by productid from our database -- which user wants in their cart
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No Product Found"
            })
        }

        /*
            Here- Jab user pahili bar koi product cart me add kr rha hai tab cart 0 pe rahega..
            and then user is trying to add another product whos having same user id toh cart me quantity increase hogi
        */
        let cart = await Cart.findOne({ userId })

        //If No cart is already present for any user... then we will create new cart for that user
        if (!cart) {
            cart = new Cart({ userId, items: [] })
        }

        /* Adding product to cart */
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)
        if (findCurrentProductIndex === -1) {
            cart.items.push({productId, quantity})
        }
        //Same Product is already present in cart.. then we need to increase quantity
        else {
            cart.items[findCurrentProductIndex].quantity += quantity
        }

        //Saving to Database
        await cart.save()

        res.status(200).json({
            success: true,
            data: cart
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}




/*-----------------------
Writing Controller for Fetching product from cart
------------------------*/
const fetchCartItem = async (req, res) => {
    try {
        //Getting userid -- by this we will fetch product
        const { userId } = req.params
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is mandatory"
            })
        }

        //Finding Cart of that user.. checking if already present or not
        const cart = await Cart.findOne({userId}).populate({
            path: 'items.productId',
            select: "image title price salePrice"
        })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            })
        }


        /*
        Jab aapne 1 product cart me add kiya hai.. then usi time pe admin ne same product database se delete kr diya hai...
        then vo product user's cart me se bhi remove hona chaiye
        */
        const validItems = cart.items.filter(productItem => productItem.productId)
        if (validItems.length < cart.items.length) {
            cart.items = validItems
            await cart.save()
        }

        const populateCartitems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }))

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartitems
            }
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}



/*-----------------------
Writing Controller for updating product quantity of cart
------------------------*/
const updateCartQuantity = async (req, res) => {
    try {
        //Getting (userId, productId, quantity)
        const { userId, productId, quantity } = req.body
        if (!userId || !productId || quantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid Data Provided"
            })
        }

        //Finding cart to updating that
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            })
        }

        //Finding Item's Index -- That we wanna update
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)
        if (!findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Cart item not present"
            })
        }

        cart.items[findCurrentProductIndex].quantity = quantity
        await cart.save()


        //if products is adding to cart -- cart will get update
        await cart.populate({
            path: 'items.productId',
            select: "image title price salePrice"

        })


        const populateCartitems = cart.items.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : 'Page not found',
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity
        }))

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartitems
            }
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}



/*-----------------------
Writing Controller for deleting product of cart
------------------------*/
const deleteCartItem = async (req, res) => {
  try {
    /*------------------------------
    Getting user id for which we are deleting product from their cart
    Getting product id .. for which product we are deleting from that user's cart
    -------------------------------*/
    const { userId, productId } = req.params

    if (!userId || !productId)
      return res.status(400).json({
        success: false,
        message: "Invalid data provided"
      })

    
    //Getting Product Id and Userid from Database
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      })
    const cart = await Cart.findOne({ userId })
    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      })


    // Remove matching item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    )

    await cart.save()

    // THEN re‐populate only the remaining valid items
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    })

    // Now strip out missing product data
    const filteredItems = cart.items
      .filter(item => item.productId)  // removes items with null productId
      .map(item => ({
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity
      }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: filteredItems
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}


module.exports = { addToCart, fetchCartItem, updateCartQuantity, deleteCartItem }



