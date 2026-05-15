/*------------------------------------------
    Building logic and Design for Checkout Page
-------------------------------------------*/
import Address from "@/components/shopping-view/address";
import checkoutImg from "../../assets/checkout.jpg"
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsLayout from "@/components/shopping-view/cartItems-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { Badge } from "lucide-react";

function ShoppingCheckout() {

  //Getting Cart Items -- Which is added by user
  const {cartItems} = useSelector(state => state.shopCart)
  const dispatch = useDispatch()


  /*------------------------------
  Calculating Total Amount of Cart
  -------------------------------*/
  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ?
    cartItems.items.reduce((total, allCartItem) => total + (allCartItem?.salePrice > 0 ? allCartItem?.salePrice : allCartItem?.price) * allCartItem?.quantity, 0) : 0;


  /*------------------------------
  Creating function to Initiate Paypal Payment
  -------------------------------*/
  const {user} = useSelector((state) => state.auth)

  //Creating State to manage address while checking out
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)

  //Creating State to check if payment start or failed
  const [isPaymentStart, setIsPaymentStart] = useState(false)

  //getting approval state from redux store
  const {approvalURL} = useSelector((state)=> state.shopOrder)
  

  function handleInitiatePaypalPayment(){

    //Checking if any of item is added to cart or not
    if(cartItems.length === 0){
      toast("Your cart is empty. Please add products!", {
        style : {background : "#ff0000"}
      })
      return
    }

    //Checking if user added address or not
    if(currentSelectedAddress === null){
      toast("Please select address!", {
        style : {background : "#ff0000"}
      })
      return
    }


    const orderData = {
                    userId : user?.id,
                    cartId : cartItems?._id,
                    cartItems : cartItems.items.map(singleCartItem => ({
                      productId : singleCartItem?.productId,
                      title : singleCartItem?.title,
                      image : singleCartItem?.image,
                      price : singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem.price,
                      quantity : singleCartItem?.quantity
                    })),
                    addressInfo : {
                              addressId: currentSelectedAddress?._id,
                              address: currentSelectedAddress?.address,
                              city: currentSelectedAddress?.city,
                              pincode: currentSelectedAddress?.pincode,
                              phone: currentSelectedAddress?.phone,
                              notes: currentSelectedAddress?.notes,
                    },
                    orderStatus : "pending",
                    paymentMethod : 'paypal',
                    paymentStatus : 'pending',
                    totalAmount : totalCartAmount,
                    orderDate : new Date,
                    orderUpdateDate : new Date,
                    paymentId : '',
                    payerId : '',
    }
    console.log(orderData);
    

    /*----------------------------------
    Dispatching all this order information to createNewOrder -- Asyncthunk
    ------------------------------------*/
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data);

      if(data?.payload?.success){
        setIsPaymentStart(true)
      }else{
        setIsPaymentStart(false)
      }
    })
  }


  /*---------------------------------
  After successfully hitting the Chekcout with paypal -- We will goes to Paypal payment page
  -----------------------------------*/
  if(approvalURL){
    window.location.href = approvalURL
  }


  return (
    <div className="flex flex-col">
      <div className="relative h-[450px] w-full overflow-hidden">
        <img src={checkoutImg} alt="Checkout-Page" className="h-full w-full object-cover object-center"/>
      </div>

      {/* Getting User's Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress}/>
        <div className="flex flex-col gap-4">
          {
            cartItems && cartItems.items && cartItems.items.length > 0 ?
            cartItems.items.map(item => <UserCartItemsLayout cartItem={item}/>) : null
          }
        <div className="space-y-4 p-5">
          <div className="flex justify-between">
            <span className="font-bold ">Total</span>
            <span className="font-bold">${totalCartAmount}</span>
          </div>
        </div>
          <div className="mt-4 w-full">
            {/* Whne we are saving any User's Data for first time it should be static */}
            <Button onClick ={handleInitiatePaypalPayment} className='w-full'>
              {
                isPaymentStart ? 'Processing PayPal Payment' : 'Checkout with PayPal'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout;
