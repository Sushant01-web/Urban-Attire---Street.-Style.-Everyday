/*------------------------------------------
    Building logic and Design for Home Page
-------------------------------------------*/
import React, { useEffect, useState } from "react";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import pumaSlider from "../../assets/Puma_Slider.jpg";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  Venus,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import MiniFooter from "@/components/shopping-view/footer";


//User will shop by categories
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

//User will shop by brand
const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  /*-------------------------------------
  Creating Slider Functionality
  --------------------------------------*/
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();

  //Creating array of images then map it
  const slides = [bannerOne, bannerTwo, bannerThree, pumaSlider];
  //Creating useeffect so home screen slide will change automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);



  /*----------------------------------
  Creating a function that will -- navigate Products on home page direct to listing page and filter them according to their category
  -----------------------------------*/
  const navigate = useNavigate()
  function handleCartItemToListing(getCurrentId, section){
    //Firstly Removing Filter, if it as already selected
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentId.id],
    };

    //Setting New Filter
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }


  /*-----------------------------
  Creating Function to get product details after click
  ------------------------------*/
  function handleGetProductDetails(getCurrentProductID) {
    dispatch(fetchProductDetails(getCurrentProductID));
  }


  /*----------------------------
  Creating Function to adding product to cart -- When user click on add to cart button
  -----------------------------*/
  const {user} = useSelector((state) => state.auth)
  const {cartItems} = useSelector(state => state.shopCart)
    function handleAddToCart(getCurrentProductId, getTotalStock) {
    //According to totalStock product's quantity we have to add to cart
    //Over totalstock we cannot able to add and show some message
    let getCartItems = cartItems.items || []

    if(getCartItems.length){
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)

      if(indexOfCurrentItem > -1){
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if(getQuantity + 1 > getTotalStock){
          toast(`Only ${getQuantity} can be add for this item`, {
            style: {
              background: "#ef4444",   // red-500
              color: "white",
              border: "none",
            }
          })
          return
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

  //Fetching product details after click on product
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}

        {/* Left Slider button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {/* Right slider button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Mapping shop by category items */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Category
          </h2>

          {/* Mapping Categories Here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={()=> handleCartItemToListing(categoryItem, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mapping shop by brand items */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>

          {/* Mapping Categories Here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card onClick={()=> handleCartItemToListing(brandItem, "brand")} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mapping Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productList && productList.length > 0
              ? productList.slice(0, 15).map((productItem) => (
                  <ShoppingProductTile
                  product={productItem}

                  //Passing handleGetProductDetails to get product details after click
                  handleGetProductDetails ={handleGetProductDetails}

                  //Passing handleAddToCart to add product to cart -- when user click on Add to Cart button
                  handleAddToCart = {handleAddToCart}
                   />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Rendering Products details after click on product */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      <MiniFooter/>
    </div>
  );
}

export default ShoppingHome;
