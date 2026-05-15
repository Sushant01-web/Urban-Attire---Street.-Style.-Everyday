/*-----------------------------
Here We will create function to Call Address's Apis to Display Address on UI
------------------------------*/

import { Label } from "../ui/label";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

//Getting Address info which is saving by address.jsx file
function AddressCard({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId }) {

  return (
      <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-2"
          : "border-black"
      }`}
    >

      <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' : ''} grid gap-4`}>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Note: {addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button onClick = {()=> handleEditAddress(addressInfo)} className='cursor-pointer'>Edit</Button>
        <Button onClick = {()=> handleDeleteAddress(addressInfo)} className='cursor-pointer'>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;


