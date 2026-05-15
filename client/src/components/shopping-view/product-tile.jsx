//This will help to render images on shopping listing pages

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

//Receiving product id as parameter
function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto group">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative overflow-hidden rounded-t-lg mb-5">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-400 group-hover:scale-120"
          />
          {
          product.totalStock === 0 ? <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge> : product.totalStock < 10 ? <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`} 
            </Badge>:
          product?.salePrice ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>

      {/* Footer of Card */}
      <CardFooter>
        {
          //If product has 0 quantity in totalstock then disable button with out of stock
          product?.totalStock === 0 ? <Button
          className="w-full opacity-65 cursor-not-allowed bg-blue-100"
        >
          Out Of Stock
        </Button> : <Button
          className="w-full opacity-60 cursor-pointer bg-blue-500"
          onClick={() => handleAddToCart(product?._id, product?.totalStock)}
        >
          Add to cart
        </Button>
        }

      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
