/*---------------------------------
Creating a dashboard for admin which handles banner images
----------------------------------*/

import ProductImagesUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImages, getFeatureImages } from "@/store/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


function AdminDashboard() {
  //Maintaining state when changed occured after image upload
  const [imageFile, setImageFile] = useState(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  //Creating state while image is being load
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const {featureImageList} = useSelector((state)=> state.featureImages)

  const dispatch = useDispatch()

  /*-----------------------------
  Creating a funtion to upload feature image
  -------------------------------*/
  function handleUploadFeatureImage(){
    dispatch(addFeatureImages(uploadedImageUrl)).then((data)=>{
      if(data?.payload?.success){
        dispatch(getFeatureImages())
        setImageFile(null)
        setUploadedImageUrl("")
      }
    })
  }
  useEffect(()=>{
    dispatch(getFeatureImages())
  },[dispatch])
  

  return (
    <div className="w-full">
          {/* Created funtion in component/admin-view/image-upload to upload images from cloudinary */}
          {/* passing props here from above created useState */}
          <ProductImagesUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            // isEditMode={currentEditedId !== null}
          />
          <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">Upload</Button>

          {/* Mapping Banner Images */}
          <div>
            {
              featureImageList && featureImageList.length > 0 ?
              featureImageList.map((featureImgItem)=>{
                <div className="relative">
                  <img src={featureImgItem.image} className="w-full h-[300px] object-cover rounded-t-lg"/>
                </div>
              }) : null
            }
          </div>
    </div>
  )
}

export default AdminDashboard;
