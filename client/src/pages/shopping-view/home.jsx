/*------------------------------------------
    Building logic and Design for Home Page
-------------------------------------------*/
import React, { useEffect, useState } from "react";

import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import pumaSlider from "../../assets/Puma_Slider.jpg";

import { Button } from "@/components/ui/button";

import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, Footprints, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, Venus, WashingMachine, WatchIcon, } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllFilteredProducts, fetchProductDetails, } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";

import { addToCart, fetchCartItems, } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import MiniFooter from "@/components/shopping-view/footer";

/*------------------------------------------
  Shop By Category
-------------------------------------------*/
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

/*------------------------------------------
  Shop By Brand
-------------------------------------------*/
const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  /*------------------------------------------
    Slider Logic
  -------------------------------------------*/
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [bannerOne, bannerTwo, bannerThree, pumaSlider,];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % slides.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  /*------------------------------------------
    Redux State
  -------------------------------------------*/
  const dispatch = useDispatch();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector(
    (state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  /*------------------------------------------
    Fetch Products
  -------------------------------------------*/
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /*------------------------------------------
    Navigate To Listing Page
  -------------------------------------------*/
  const navigate = useNavigate();

  function handleCartItemToListing(getCurrentId, section) {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentId.id],
    };

    sessionStorage.setItem(
      "filters",
      JSON.stringify(currentFilter)
    );

    navigate("/shop/listing");
  }

  /*------------------------------------------
    Product Details
  -------------------------------------------*/
  function handleGetProductDetails(getCurrentProductID) {
    dispatch(
      fetchProductDetails(getCurrentProductID)
    );
  }

  /*------------------------------------------
    Add To Cart
  -------------------------------------------*/
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem =
        getCartItems.findIndex(
          (item) =>
            item.productId === getCurrentProductId
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

  /*------------------------------------------
    Open Product Details Dialog
  -------------------------------------------*/
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/*------------------------------------------
        Hero Slider
      -------------------------------------------*/}
      <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[60vh] lg:h-[75vh] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            alt={`slide-${index}`}
            className={`${index === currentSlide
                ? "opacity-100"
                : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}

        {/* Left Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + slides.length) %
                slides.length
            )
          }
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white/80 w-8 h-8 md:w-10 md:h-10"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {/* Right Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide + 1) % slides.length
            )
          }
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white/80 w-8 h-8 md:w-10 md:h-10">
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/*------------------------------------------
        Shop By Category
      -------------------------------------------*/}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop By Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map(
              (categoryItem) => (
                <Card
                  key={categoryItem.id}
                  onClick={() =>
                    handleCartItemToListing(
                      categoryItem,
                      "category"
                    )
                  }
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                    <categoryItem.icon className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 text-primary" />

                    <span className="font-bold text-sm md:text-base">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/*------------------------------------------
        Shop By Brand
      -------------------------------------------*/}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop By Brand
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() =>
                  handleCartItemToListing(
                    brandItem,
                    "brand"
                  )
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                  <brandItem.icon className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 text-primary" />

                  <span className="font-bold text-sm md:text-base">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*------------------------------------------
        Featured Products
      -------------------------------------------*/}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Feature Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productList &&
              productList.length > 0
              ? productList
                .slice(0, 15)
                .map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    product={productItem}
                    handleGetProductDetails={
                      handleGetProductDetails
                    }
                    handleAddToCart={
                      handleAddToCart
                    }
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/*------------------------------------------
        Product Details Dialog
      -------------------------------------------*/}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/*------------------------------------------
        Footer
      -------------------------------------------*/}
      <MiniFooter />
    </div>
  );
}

export default ShoppingHome;