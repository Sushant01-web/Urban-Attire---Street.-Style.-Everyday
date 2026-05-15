import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";


function UserCartItemsLayout({cartItem}) {
  const {cartItems} = useSelector(state => state.shopCart)
  const {productList} = useSelector(state => state.shopProducts)

  /*------------------------
  Creating Function to Minus or items quantity
  --------------------------*/
  function handleUpdateQuantity(cartItem, typeOfAction){
    //if user is increasing quantity of products which is greate than totalStock then he cant add that produc
    if(typeOfAction == "plus"){
          let getCartItems = cartItems.items || []

    if(getCartItems.length){
      const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === cartItem?.productId)

      const getcurrentProductIndex = productList.findIndex(product => product._id === cartItem?.productId)
      const getTotalStock = productList[getcurrentProductIndex].totalStock

      if(indexOfCurrentCartItem > -1){
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity

        if(getQuantity +1 > getTotalStock){
          toast(`Only ${getQuantity} can be add for this item`, {
            style : {
              background : "#ef4444",
              color : "white",
              border : "none"
            }
          })
          return
        }
      }
    }
    }


    dispatch(updateCartQuantity({userId : user?.id, productId : cartItem?.productId, quantity :
      //If user clicking on Plus symbol
      typeOfAction === 'plus'? 
      cartItem?.quantity + 1 : cartItem?.quantity - 1})).then(data => {
        if(data?.payload?.success){
          toast("Cart item is updated")
        }
      })
  }


  /*-----------------------
  Creating function to delete item of cart
  ------------------------*/
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)
  const handleCartItemDelete = ()=>{
    let productId

    //We are getting product id as Object from database.. so we have to conver it to string
    if(cartItem.productId && typeof cartItem.productId === 'object'){
      productId = cartItem.productId._id
    }else{
      productId = cartItem.productId
    }

    if(!productId) return

    //Dispatching Deleteiteme asyncthunk
    dispatch(deleteCartItem({
      userId : user?.id,
      productId: productId.toString()
    }))
    toast("Cart item is deleted")
  }


  return (
    //Redering the products here which is added to cart
    <div className="flex items-center space-x-4 p-3"> 
      <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover"/>

      <div className="flex-1">
        <h3 className="font-bold text-[14px]">{cartItem?.title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-6 w-6 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-6 w-6 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-bold text-[14px]">
          ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash className="cursor-pointer mt-1" size={20} onClick={handleCartItemDelete}/>
      </div>
    </div>
    
  )
}

export default UserCartItemsLayout;
