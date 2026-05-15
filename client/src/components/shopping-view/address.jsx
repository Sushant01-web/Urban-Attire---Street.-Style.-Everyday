/*---------------------------------
This will represent Address content
----------------------------------*/

import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAddresses } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";

/*--------------------------------
Creating Initial Form Data
---------------------------------*/
const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({setCurrentSelectedAddress, selectedId}) {
  //Creating State to Mange form's state
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  //Getting State -- That will store current edited Id of address
  const [currentEditedId, setCurrentEditedId] = useState(null)



  /*----------------------------------
    Creating Function to Manage Address
    -----------------------------------*/
  function handleManageAddress(event) {
    event.preventDefault();

    //If user is adding address more than 3 
    if(addressList.length >= 3 && currentEditedId === null){
      toast("You Can Add Maximum 3 Addresses" , {
        style: {
          background: 'yellow'
        }
      })
      setFormData(initialAddressFormData)
      return
    }
    

    currentEditedId !== null ? dispatch(editAddress({userId : user?.id, addressId : currentEditedId, formData})).then((data) => {
      if(data?.payload?.success){
        dispatch(fetchAddresses(user?.id))
        setCurrentEditedId(null)
        setFormData(initialAddressFormData)
        toast("Address Updated Successfully")
      }
    }) : 
    dispatch(
      addNewAddress({
        ...formData,
        userId: user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAddresses(user?.id));
        setFormData(initialAddressFormData);
        toast("Addres Added Successfully")
      }
    });
  }
  useEffect(() => {
    dispatch(fetchAddresses(user?.id));
  }, [dispatch]);



  /*------------------------------------
  Creating Function for Delete Address if user want -- When he clicks on Delete button
  -------------------------------------*/
  function handleDeleteAddress(getCurrentAddress){
    console.log(getCurrentAddress)

    //For Deleting any address we require userid and addressId
    dispatch(deleteAddress({userId : user?.id , addressId : getCurrentAddress._id})).then(data => {
      if(data?.payload?.success){
        dispatch(fetchAddresses(user?.id))
      }
      toast("Address deleted successfully")
    })
  }



  /*------------------------------------
  Creating Function for Edit Address if user want -- When he clicks on Edit button
  -------------------------------------*/  
  function handleEditAddress(getCurrentAddress){
    setCurrentEditedId(getCurrentAddress?._id)

    //When user hit edit button -- form will gets fill with current address that user have
    setFormData({
      ...formData,
      address : getCurrentAddress?.address,
      city : getCurrentAddress?.city,
      phone : getCurrentAddress?.phone,
      pincode : getCurrentAddress?.pincode,
      notes : getCurrentAddress?.notes,
    })
  }



  /*------------------------------------
  Creating Function for check whether , if we got all field as per Mongoose Schema
  -------------------------------------*/
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  console.log("AddressList", addressList);

  return (
    <Card>
      {/* Address Will Render Here */}
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddress) => (
              <AddressCard
              selectedId={selectedId}
              key={singleAddress._id}
              handleDeleteAddress={handleDeleteAddress} 
              addressInfo={singleAddress} 
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {
            currentEditedId !== null ? "Edit Address" : "Add New Address"
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit Address" : "Add New Address"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}
export default Address;

