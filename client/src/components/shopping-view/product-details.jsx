/*--------------------
Here We Will get details of products
---------------------*/

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent,} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import StarRatingComponent from "../common/star-rating";
import { addToCart, fetchCartItems,} from "@/store/shop/cart-slice";
import {setProductDetails,} from "@/store/shop/product-slice"
import { addReview, getReview,} from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails,}) {

  /* State Management */
  const dispatch = useDispatch();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const { reviews } = useSelector(
    (state) => state.reviewProduct);

  const { user } = useSelector(
    (state) => state.auth);

  const { orders } = useSelector(
    (state) => state.shopOrder);

  const { cartItems } = useSelector(
    (state) => state.shopCart);

  /*-----------------------------
  Handle Rating Change
  ------------------------------*/
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  /*-----------------------------
  Check User Purchased Product
  ------------------------------*/
  const hasUserPurchased = orders?.some((order) =>
    order?.orderItems?.some(
      (item) =>
        item.productId === productDetails?._id
    )
  );

  /*-----------------------------
  Check User Already Reviewed
  ------------------------------*/
  const hasUserReviewed = reviews?.some(
    (review) => review.userId === user?.id
  );

  /*-----------------------------
  Add Review
  ------------------------------*/
  function handleAddReview() {
    if (!hasUserPurchased) {
      toast(
        "You need to purchase this product to review",
        {
          style: {
            background: "#ef4444",
            color: "white",
            border: "none",
          },
        }
      );
      return;
    }

    if (hasUserReviewed) {
      toast(
        "You have already reviewed this product",
        {
          style: {
            background: "#ef4444",
            color: "white",
            border: "none",
          },
        }
      );

      setRating(0);
      setReviewMsg("");
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        username: user?.username,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);

        setReviewMsg("");

        dispatch(
          getReview(productDetails?._id)
        );

        toast("Review added successfully");
      }
    });
  }

  /*-----------------------------
  Add To Cart
  ------------------------------*/
  function handleAddToCart(
    getCurrentProductId,
    getTotalStock
  ) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem =
        getCartItems.findIndex(
          (item) =>
            item.productId ===
            getCurrentProductId
        );

      if (indexOfCurrentItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentItem]
            .quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast(
            `Only ${getQuantity} can be add for this item`,
            {
              style: {
                background: "#ef4444",
                color: "white",
                border: "none",
              },
            }
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));

        toast("Product Added Successfully");
      }
    });
  }

  /*-----------------------------
  Handle Dialog Close
  ------------------------------*/
  function handleDialogClose() {
    setOpen(false);

    dispatch(setProductDetails());

    setRating(0);

    setReviewMsg("");
  }

  /*-----------------------------
  Fetch Reviews
  ------------------------------*/
  useEffect(() => {
    if (productDetails !== null) {
      dispatch(
        getReview(productDetails?._id)
      );
    }
  }, [productDetails, dispatch]);

  /*-----------------------------
  Calculate Average Review
  ------------------------------*/
  const averageReview = reviews && reviews.length > 0
      ? reviews.reduce(
          (sum, reviewItem) =>
            sum + reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogClose}
    >
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 md:p-8 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[75vw] max-h-[95vh] overflow-y-auto">
        {/*----------------------------------
          Product Image
        -----------------------------------*/}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>

        {/*----------------------------------
          Product Details
        -----------------------------------*/}
        <div className="flex flex-col gap-4">
          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {productDetails?.title}
          </h1>

          {/* Description */}
          <p className="text-sm md:text-lg text-muted-foreground">
            {productDetails?.description}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-3 flex-wrap">
            <p
              className={`text-xl md:text-2xl font-bold text-primary ${
                productDetails?.salePrice > 0
                  ? "line-through"
                  : ""
              }`}
            >
              ${productDetails?.price}
            </p>

            {productDetails?.salePrice >
            0 ? (
              <p className="text-xl md:text-2xl font-bold text-green-600">
                $
                {
                  productDetails?.salePrice
                }
              </p>
            ) : null}
          </div>

          {/* Average Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarRatingComponent
                rating={averageReview}
              />
            </div>

            <span className="text-sm text-muted-foreground">
              (
              {averageReview.toFixed(2)}
              )
            </span>
          </div>

          {/* Add To Cart */}
          <div className="mt-2">
            {productDetails?.totalStock ===
            0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out Of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add To Cart
              </Button>
            )}
          </div>

          <Separator />

          {/*----------------------------------
            Reviews Section
          -----------------------------------*/}
          <div className="max-h-[300px] overflow-y-auto pr-1">
            <h2 className="text-xl font-bold mb-4">
              Reviews
            </h2>

            <div className="grid gap-5">
              {reviews &&
              reviews.length > 0 ? (
                reviews
                  .slice(-3)
                  .map((reviewItem) => (
                    <div
                      key={
                        reviewItem._id
                      }
                      className="flex gap-3"
                    >
                      <Avatar className="w-10 h-10 border shrink-0">
                        <AvatarFallback>
                          {reviewItem?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="font-semibold text-sm md:text-base">
                          {
                            reviewItem?.username
                          }
                        </h3>

                        <div className="flex items-center gap-1">
                          <StarRatingComponent
                            rating={
                              reviewItem?.reviewValue
                            }
                          />
                        </div>

                        <p className="text-sm text-muted-foreground wrap-break-word">
                          {
                            reviewItem?.reviewMessage
                          }
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <h3 className="text-muted-foreground">
                  No reviews
                </h3>
              )}
            </div>

            {/*----------------------------------
              Write Review
            -----------------------------------*/}
            <div className="mt-8 flex flex-col gap-3">
              <Label className="text-sm md:text-base">
                Write a review
              </Label>

              <div className="flex items-center gap-2 flex-wrap">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={
                    handleRatingChange
                  }
                />
              </div>

              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) =>
                  setReviewMsg(
                    e.target.value
                  )
                }
                placeholder="Write a review..."
                className="text-sm"
              />

              <Button
                onClick={handleAddReview}
                disabled={
                  reviewMsg.trim() === ""
                }
                className="w-full sm:w-fit"
              >
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