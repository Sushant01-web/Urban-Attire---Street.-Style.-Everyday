import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsLayout from "./cartItems-content";

/*---------------------------------
This will represent cart content
----------------------------------*/


//Receiving Cart item as a prop .. so we can display items in our cart section
function UserCartWrapper({cartItems, setOpenCartSheet}) {
  const navigate = useNavigate()

  /*------------------------------
  Calculating Total Amount of Cart
  -------------------------------*/
  const totalCartAmount = cartItems && cartItems.length > 0 ?
    cartItems.reduce((total, allCartItem) => total + (allCartItem?.salePrice > 0 ? allCartItem?.salePrice : allCartItem?.price) * allCartItem?.quantity, 0) : 0;


  return (
    <SheetContent className="sm:max-w-md ">
      <SheetHeader>
        <SheetTitle>Your Cart Items</SheetTitle>
      </SheetHeader>

      {/* Displaying Cart Items */}
      <div className="space-y-4">
        {
          cartItems && cartItems.length > 0 ?
          cartItems.map(item => <UserCartItemsLayout cartItem={item}/>) : null
        }
      </div>

      <div className="space-y-4 p-5">
        <div className="flex justify-between">
          <span className="font-bold ">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>

      <Button onClick = {() => {
        navigate('/shop/checkout')
        setOpenCartSheet(false)
      }} className="w-full mt-2">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
