/*------------------------------------------
    Building logic and Design for Checkout Page
-------------------------------------------*/

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Address from "@/components/shopping-view/address";
import UserCartItemsLayout from "@/components/shopping-view/cartItems-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import checkoutImg from "../../assets/checkout.jpg";

function ShoppingCheckout() {
  /*------------------------------------------
    Redux Store
  -------------------------------------------*/
  const dispatch = useDispatch();

  const { cartItems } = useSelector(
    (state) => state.shopCart);

  const { user } = useSelector(
    (state) => state.auth);

  const { approvalURL } = useSelector(
    (state) => state.shopOrder);

  /*------------------------------------------
    State Management
  -------------------------------------------*/
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  /*------------------------------------------
    Calculate Total Cart Amount
  -------------------------------------------*/
  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (total, allCartItem) =>
            total +
            (allCartItem?.salePrice > 0
              ? allCartItem?.salePrice
              : allCartItem?.price) *
              allCartItem?.quantity,
          0
        )
      : 0;

  /*------------------------------------------
    Handle PayPal Payment
  -------------------------------------------*/
  function handleInitiatePaypalPayment() {
    // Check Empty Cart
    if (
      !cartItems?.items ||
      cartItems.items.length === 0
    ) {
      toast(
        "Your cart is empty. Please add products!",
        {
          style: {
            background: "#ff0000",
            color: "white",
          },
        }
      );
      return;
    }

    // Check Address Selected
    if (currentSelectedAddress === null) {
      toast("Please select address!", {
        style: {
          background: "#ff0000",
          color: "white",
        },
      });
      return;
    }

    const orderData = { userId: user?.id, cartId: cartItems?._id,
      cartItems: cartItems.items.map(
        (singleCartItem) => ({
          productId:
            singleCartItem?.productId,

          title: singleCartItem?.title,

          image: singleCartItem?.image,

          price:
            singleCartItem?.salePrice > 0
              ? singleCartItem?.salePrice
              : singleCartItem.price,

          quantity:
            singleCartItem?.quantity,
        })
      ),

      addressInfo: {
        addressId:
          currentSelectedAddress?._id,

        address:
          currentSelectedAddress?.address,

        city:
          currentSelectedAddress?.city,

        pincode:
          currentSelectedAddress?.pincode,

        phone:
          currentSelectedAddress?.phone,

        notes:
          currentSelectedAddress?.notes,
      },

      orderStatus: "pending",

      paymentMethod: "paypal",

      paymentStatus: "pending",

      totalAmount: totalCartAmount,

      orderDate: new Date(),

      orderUpdateDate: new Date(),

      paymentId: "",

      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then(
      (data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true);
        } else {
          setIsPaymentStart(false);
        }
      }
    );
  }

  /*------------------------------------------
    Redirect To PayPal
  -------------------------------------------*/
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/*------------------------------------------
        Responsive Banner Image
      -------------------------------------------*/}
      <div className="relative w-full overflow-hidden h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        <img
          src={checkoutImg}
          alt="Checkout-Page"
          className="w-full h-full object-cover object-center"/>

        {/* Optional Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/*------------------------------------------
        Checkout Content
      -------------------------------------------*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-5 md:p-8">
        {/* Address Section */}
        <div className="w-full">
          <Address
            selectedId={
              currentSelectedAddress
            }
            setCurrentSelectedAddress={
              setCurrentSelectedAddress
            }
          />
        </div>

        {/* Cart Items Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Cart Products */}
          {cartItems &&
          cartItems.items &&
          cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsLayout
                  key={item.productId}
                  cartItem={item}
                />
              ))
            : null}

          {/* Total */}
          <div className="space-y-4 border rounded-lg p-4 sm:p-5 shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <span className="font-bold text-base sm:text-lg">
                Total
              </span>

              <span className="font-bold text-base sm:text-lg">
                $
                {totalCartAmount.toFixed(
                  2
                )}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="w-full">
            <Button
              onClick={
                handleInitiatePaypalPayment
              }
              className="w-full h-11 sm:h-12 text-sm sm:text-base"
            >
              {isPaymentStart
                ? "Processing PayPal Payment..."
                : "Checkout with PayPal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;