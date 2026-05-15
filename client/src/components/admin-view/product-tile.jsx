//Listing products on admin's product page

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

//Getting details of products.. Wrapping it into card and make function to render in product page of admin by mapping
function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProducts,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-amber-50 group">
      <div>
        <div className="relative overflow-hidden rounded-t-lg mb-5">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-400 group-hover:scale-120"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={` ${
                product?.salePrice > 0 ? "line-through" : ""
              } text-xl font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProducts(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
