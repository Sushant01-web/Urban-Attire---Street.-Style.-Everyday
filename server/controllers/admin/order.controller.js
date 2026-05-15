/*-------------------------------------
Writing a logic to handle all order of all user
---------------------------------------*/
const Order = require("../../models/orders.model")


//1. Getting all Orders of all User
const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

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


//2. Getting details of order
const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


//3. Updating the order status -- when we changes in Admin view it will automatically change in shopping view too,, cause we are changes with userId
const updateOrderStatus = async(req, res)=>{
  try {
    //According to Id we will update the status of order
    const {id} = req.params
    const {orderStatus} = req.body

    const order = await Order.findById(id)

    //Agar order present nah ho toh
    if(!order){
      return res.status(404).json({
        success : false,
        message : "Order not found"
      })
    }
    
    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success : true,
      data : order,
      message : "Order status update successfully"
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "Some error occured"
    })
  }
}


module.exports = {getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus}