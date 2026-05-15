/*-------------------------------
Creating a search page which will display the products
after successfull search
---------------------------------*/

import ProductDetailsDialog from "@/components/shopping-view/product-details"
import ShoppingProductTile from "@/components/shopping-view/product-tile"
import { Input } from "@/components/ui/input"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchProductDetails } from "@/store/shop/product-slice"
import { getSearchResult, resetSearchResults } from "@/store/shop/search-slice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"


//Creating a main search function
function SearchProducts(){
    const [keyword, setKeyword] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const {searchResult} = useSelector(state => state.searchProduct)
    const {user} = useSelector(state => state.auth)
    const {cartItems} = useSelector(state => state.shopCart)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productDetails } = useSelector((state) => state.shopProducts);


    useEffect(()=>{
        if(keyword && keyword.trim() !== '' && keyword.trim().length > 1){
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResult(keyword))
            }, 1000);
        }else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults());
        }
    },[keyword])


    /*---------------------------------
    Creating a function to add products to cart
    -----------------------------------*/
    function handleAddToCart(getCurrentProductId, getTotalStock){
        //According to totalstock of product , it will add to the cart
        let getCartItems = cartItems.items || []

        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)

            if(indexOfCurrentItem > -1){
                const getQuantity = getCartItems[indexOfCurrentItem].quantity
                if(getQuantity + 1 > getTotalStock){
                    toast(`Only ${getQuantity} can be add for this product`, {
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

        dispatch(addToCart({
            userId : user?.id,
            productId : getCurrentProductId,
            quantity : 1
        })).then(data => {
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id))
                toast("Product is added to cart")
            }
        })
    }


    /*--------------------------------
    Creating a function to get details of products
    ----------------------------------*/
    function handleGetProductDetails(getCurrentProductId){
        dispatch(fetchProductDetails(getCurrentProductId))
    }
    useEffect(()=>{
        if(productDetails !== null) setOpenDetailsDialog(true)
    },[productDetails])


    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            {/* Creating a search bar */}
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input
                    value={keyword}
                    name="keyword"
                    onChange={(event) => setKeyword(event.target.value)}
                    className="py-6"
                    placeholder="Search Products..."
                    />
                </div>
            </div>
            {!searchResult.length ? (
                <h1 className="text-3xl font-bold">No result found!</h1>
            ) : null}
            {/* Searched Products will be displayed here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    searchResult.map(item => <ShoppingProductTile handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} product={item}/>)
                }
            </div>
            <ProductDetailsDialog
            open={openDetailsDialog}
            setOpen={setOpenDetailsDialog}
            productDetails={productDetails}
            />
      </div>
    )
}

export default SearchProducts