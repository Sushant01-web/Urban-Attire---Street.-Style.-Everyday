//Writing Code for listing page of shopping view

import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { ArrowUpDownIcon } from "lucide-react";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

/*-----------------------
Main Function Starts here
------------------------*/

function ShoppingListing() {
  const dispatch = useDispatch();

  //Getting product list which is created in store/product-slice/index.js
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  
  const [searchParams, setSearchParams] = useSearchParams();

  const {cartItems} = useSelector(state => state.shopCart)
  

  const categorySearchParams = searchParams.get('category')

  /*-------------------------------
  To Maintain the state after applying sort on products
  --------------------------------*/
  const [sort, setSort] = useState(() => {
    return localStorage.getItem("sort") || "price";
  });
  // console.log("Current sort:", sort);
  //Maintaining the same sort even after refreshing the page
  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  /*-------------------------------
  To Maintain the state after applying filter on products
  --------------------------------*/
  const [filters, setFilters] = useState({});
  //Creating function for filtering items
  function handleFilter(getSectionId, getCurrentOption) {
    //Checking current checkbox is present in that secrtion or not
    let copyFilters = { ...filters };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    //Checking that category or brand is present or not
    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption],
      };
    }
    //jab aur koi filter apply krna chah rhe ho .. toh vo ek hi array me pass nhi ho rha hai..isliye follow below code
    else {
      const indexOfCurrentSection =
        copyFilters[getSectionId].indexOf(getCurrentOption);

      //If Curently checked box is absent then follow below.. this will help to create multiple choice to add or  remove
      if (indexOfCurrentSection === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentSection, 1);
      }
    }
    setFilters(copyFilters);

    //Saving these choices to sessionstorage
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }
  //Keeping same choices of filter ...even after refreshing the page
  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  /*-------------------------
  Creating Funtion for Search params
  ---------------------------*/
  function createSearchParamsHelper(filterParams) {
    //Getting empty Array
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        //Pushing selected category or brand to url
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    return queryParams.join("&");
  }
  //Creating useeffecto for.. whenever we click on filter it should be go in URL also
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  //Fetch list of products - i.e iamges
  useEffect(() => {
    if (filters !== null && sort)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);


  
  /*-----------------------
  Creating function to getting product details
  ------------------------*/
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  function handleGetProductDetails(getCurrentProductID) {
    console.log(getCurrentProductID);
    dispatch(fetchProductDetails(getCurrentProductID));
  }
  //Fetching product details after click on product
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);



  /*------------------------
  Creating function to adding product to cart
  -------------------------*/
  //Getting userid
  const { user } = useSelector((state) => state.auth);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-6 p-4 md:p-6">
      {/* Importing filter from component/shopping-view/filter.jsx */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            {/* Passing product list length so it will be visible on header */}
            <span className="text-muted-foreground">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {/* Sorting price wise which is we configure in config.index.js */}
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Rendering Images */}
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {
            //Listing All Products
            productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    key={productItem.id}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null
          }
        </div>
      </div>
      <div>
        {/* Rendering Products details after click on product */}
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
}

export default ShoppingListing;
