/*--------------------
Here We Will get details of products
---------------------*/

import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReview } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)
  const {reviews} = useSelector(state => state.reviewProduct)
  const { user } = useSelector((state) => state.auth);
  const {orders} = useSelector((state)=> state.shopOrder)


  /*-----------------------------
  This function will allow user to add stars as per rating
  ------------------------------*/
  function handleRatingChange(getRating){
    setRating(getRating)
  }

  const hasUserPurchased = orders?.some(order =>
  order?.orderItems?.some(
    item => item.productId === productDetails?._id
  )
);


  /*-----------------------------
  Check if user already reviewed
  ------------------------------*/
  const hasUserReviewed = reviews?.some(
    (review) => review.userId === user?.id
  );

  /*-----------------------------
  Creating a function to add reviews
  ------------------------------*/
  // function handleAddReview(){
  //   if (hasUserReviewed) {
  //   toast("You have already reviewed this product",{
  //     style : {
  //       background : "#ef4444",
  //       color : "white",
  //       border : "none"
  //     }
  //   });
  //   setRating(0);
  //   setReviewMsg("");
  //   return;
  // }
  //   dispatch(addReview({
  //     productId : productDetails?._id,
  //     userId : user?.id,
  //     username : user?.username,
  //     reviewMessage : reviewMsg,
  //     reviewValue : rating
  //   })).then(data => {
  //     if(data?.payload?.success){
  //       setRating(0);
  //       setReviewMsg("");
  //       dispatch(getReview(productDetails?.id))
  //       toast("Review added successfully")
  //     }
  //   })
  // }


  function handleAddReview() {

  if (!hasUserPurchased) {
    toast("You need to purchase this product to review", {
      style: {
        background: "#ef4444",
        color: "white",
        border: "none"
      }
    });
    return;
  }

  if (hasUserReviewed) {
    toast("You have already reviewed this product", {
      style: {
        background: "#ef4444",
        color: "white",
        border: "none"
      }
    });
    setRating(0);
    setReviewMsg("");
    return;
  }

  dispatch(addReview({
    productId: productDetails?._id,
    userId: user?.id,
    username: user?.username,
    reviewMessage: reviewMsg,
    reviewValue: rating
  })).then(data => {
    if (data?.payload?.success) {
      setRating(0);
      setReviewMsg("");
      dispatch(getReview(productDetails?._id));
      toast("Review added successfully");
    }
  });
}

  /*-----------------------------
  Add to cart function to Dialog Opne box
  ------------------------------*/
  const dispatch = useDispatch()
  const {cartItems} = useSelector(state => state.shopCart)

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    //According to totalStock product's quantity we have to add to cart
    //Over totalstock we cannot able to add and show some message
    let getCartItems = cartItems.items || []

    if(getCartItems.length){
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)

      if(indexOfCurrentItem > -1){
        const getQuantity = getCartItems[indexOfCurrentItem].quantity

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
    dispatch(addToCart({userId : user?.id, productId : getCurrentProductId, quantity : 1})).then((data)=> {
      if(data?.payload?.success){
        dispatch(fetchCartItems(user?.id))
        toast("Product Added Successfully");
      }
    })
  }


  /*-----------------------------
  Creating a function that not automatically reopen the dialog product box when we come back to that
  -------------------------------*/
  function handleDialogClose(){
    setOpen(false)
    dispatch(setProductDetails())
    setRating(0)
    setReviewMsg('')
  }

    useEffect(() => {
    if (productDetails !== null) dispatch(getReview(productDetails?._id));
  }, [productDetails]);


  //calculating average review
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;



  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-xl">{productDetails?.description}</p>

          {/* This is for pricing */}
          <div className="flex items-center justify-between">
          <p
            className={`text-[18px] font-bold text-primary ${
              productDetails?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            ${productDetails?.price}
          </p>
          {productDetails?.salePrice > 0 ? (
            <p className="text-[18px] font-bold text-muted-foreground">
              ${productDetails?.salePrice}
            </p>
          ) : null}
        </div>
        {/* For Product reviews adding stars */}
        <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <StarRatingComponent rating={averageReview}/>
            </div>
            <span className="text-muted-foreground text-[15px]">({averageReview.toFixed(2)})</span>
        </div>
        

          {/* Adding Button for Add to Cart Option */}
          <div className="mt-6 mb-5">
          {
          //If product has 0 quantity in totalstock then disable button with out of stock
          productDetails?.totalStock === 0 ? <Button
          className="w-full opacity-65 cursor-not-allowed bg-blue-100">
          Out Of Stock
          </Button> : <Button className="w-full opacity-60 cursor-pointer bg-blue-500"
          onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}>
          Add to cart
          </Button>
          }
          </div>

        {/* Adding Separator for reviews */}
        <Separator/>
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mt-4">Reviews</h2>
            <div className="grid gap-6 mt-3">
            {/* Mapping reviews of users */}
            {
              reviews && reviews.length > 0 ?
              reviews.slice(-3).map((reviewItem) => <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>{reviewItem?.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                {/* Username will appear here */}
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{reviewItem?.username}</h3>
                  </div>

                  {/* User's Comment will appear here */}
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <StarRatingComponent rating={reviewItem?.reviewValue}/>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                  </div>
                </div>
              </div>) : <h3>No reviews</h3>
            }
            </div>

            {/* Adding Textbox for adding comment from user */}
            <div className="mt-10 flex flex-col gap-2">
              <Label>Write a review</Label>

              <div className="flex gap-4">
                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange}/>
              </div>

              <Input
                name="reviwMsg"
                value={reviewMsg}
                onChange={(e)=> setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />

              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
