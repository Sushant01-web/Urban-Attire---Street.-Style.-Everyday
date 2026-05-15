import ProductImagesUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice";
import { Key } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data } from "react-router-dom";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  //Creating state to manage while adding products
  const [openCreateProducts, setOpenCreateProducts] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  //Maintaining state when changed occured after image upload
  const [imageFile, setImageFile] = useState(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  //Creating state while image is being load
  const [imageLoadingState, setImageLoadingState] = useState(false);

  //Creating State to get current edited Item's id
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.AdminProducts);
  const dispatch = useDispatch();


  //creating onsubmit function to save this form or when you want list of products then use usedispatch
  function onSubmit(event) {
    event.preventDefault();

    //When user refreshes the page he will get latest products
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData : formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          //If Promise get fulfilled then fetch the changes in products
          if(data?.payload?.success){
            dispatch(fetchAllProducts())
            //Reseting form
            setFormData(initialFormData)
            
            //Closing the form
            setOpenCreateProducts(false)

            //Setting form id as null
            setCurrentEditedId(null)
          }
        })
      : /*
    Calling Asyncthunk method which is created in config/admin/index.js
    When the form is submitted - It sends formdata and uploadedImageUrl to Redux and add New Product
    */
        dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            // Reset form
            setFormData(initialFormData);

            // Reset image state
            setImageFile(null);
            setUploadedImageUrl("");

            // Close sheet
            setOpenCreateProducts(false);

            // Show toast
            toast("Product Added Successfully");

            // Reload products
            dispatch(fetchAllProducts());
          }
        });
  }


  //Creating function to delete product
  function handleDelete(getCurrentProdutId){
    console.log(getCurrentProdutId)

    //Getting function from asyncthunk i.e delte product
    dispatch(deleteProduct(getCurrentProdutId)).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
      }
    })
  }


  //Disabling Add Button before it gets all field filled
  function isFormValid(){
    return Object.keys(formData).map(key => formData[key] !== "").every(item => item)
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(productList, uploadedImageUrl);
  return (
    <Fragment>
      <div className="flex mt-5 justify-end">
        <Button onClick={() => setOpenCreateProducts(true)}>
          Add New Product
        </Button>
      </div>

      {/* List of product will render here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-20 h-10px">
        {
          //Rendering products list here which
          productList && productList.length > 0
            ? //Mapping product list
              productList.map((productItem) => (
                //When we want to edit already added product.. then form should reopen again with current details of product
                <AdminProductTile
                  product={productItem}
                  setCurrentEditedId={setCurrentEditedId}
                  setOpenCreateProducts={setOpenCreateProducts}
                  setFormData={setFormData}
                  handleDelete={handleDelete}
                />
              ))
            : null
        }
      </div>

      {/* Creating Sheet for opening fields in smallaer screen device */}
      <Sheet
        open={openCreateProducts}
        onOpenChange={(isOpen) => {
          setOpenCreateProducts(isOpen);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="left" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {
                //If product already add hai aur hum edit button pe click kre toh form me edit option show kara do else Add New Product shoe krao
                currentEditedId !== null ? "Edit Product" : "Add New Product"
              }
            </SheetTitle>
          </SheetHeader>

          {/* Created funtion in component/admin-view/image-upload to upload images from cloudinary */}
          {/* passing props here from above created useState */}
          <ProductImagesUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              //Adding products from config/index.js
              formControls={addProductFormElements}
              //pasing formdata which we have creaated
              formData={formData}
              setFormData={setFormData}
              buttonText={
                //If product already add hai aur hum edit button pe click kre toh form me edit option show kara do else Add New Product shoe krao
                currentEditedId !== null ? "Edit" : "Add"
              }
              onSubmit={onSubmit}

              //Disabling Add Button until all field gets filled
              // isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
