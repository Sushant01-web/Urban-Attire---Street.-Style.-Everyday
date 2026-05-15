/*-----------------------------------
This will create a order based on userId products Id
------------------------------------*/

const paypal = require("../../helpers/paypal")
const Order = require("../../models/orders.model")
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")

//1. Creating Order -- Here we will save order in database after user trying to complete his payment
const createOrder = async (req, res) => {
    try {

        //Getting Required field as per OrderShcme --  which is created in models/oders.js
        const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body


        //Creating Payment Json
         const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };


        //Creating Paypal Payment Methd
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);

                return res.status(500).json({
                    success: false,
                    message: "Error while creating paypal payment",
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId,
                });

                await newlyCreatedOrder.save()


                //Getting Payment Approval Link
                const approvalURL = paymentInfo.links.find(link => link.rel === "approval_url").href

                res.status(200).json({
                    success : true,
                    approvalURL,
                    orderId : newlyCreatedOrder._id
                })
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


//2. Capture Payment -- Here we check payment is successfull or not
const capturePayemnt = async (req, res) => {
    try {

      //For this we requires -- paymentId, payerId and orderId
      const {paymentId, payerId, orderId} = req.body

      //Finding order from our Database
      let order = await Order.findById(orderId)

      //Checking order is present or not
      if(!order){
        return res.status(404).json({
          success : false,
          message : "Order cannot be found"
        })
      }

      //After successfully checking on order is present or not
      order.paymentStatus = 'paid'
      order.orderStatus = 'confirmed'
      order.paymentId = paymentId
      order.payerId = payerId

      //After Placing succssfull order we need to Minus ordered quantity of product from existing stock of that product
      for(let item of order.cartItems){
        //finding product from databse
        let product = await Product.findById(item.productId)

        //If vo product present nahi hai then
        if(!product){
          return res.status(404).json({
            success : false,
            message : `Not enough stock for this  product ${product.title}`
          })
        }

        //If product present hai to ordered quantity ,, total stock se minus krdo
        product.totalStock -= item.quantity

        await product.save()
      }

      //Getting Cartitemm to display after payment succes
      const getCartId = order.cartId
      await Cart.findByIdAndDelete(getCartId)

      await order.save()

      res.status(200).json({
        success : true,
        message : "Order Confirmed",
        data : order
      })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}


//3. Getting Orders of User
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


//4. Getting order details of user
const getOrderDetails = async(req, res)=>{
  try {

    const {id} = req.params

    const order = await Order.findById(id)

    if(!order){
      return res.status(404).json({
        success : false,
        message : "Order not found"
      })
    }

    res.status(200).json({
      success : true,
      data : order
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "Some error occured"
    })
  }
}

module.exports = { createOrder, capturePayemnt, getAllOrdersByUser, getOrderDetails }