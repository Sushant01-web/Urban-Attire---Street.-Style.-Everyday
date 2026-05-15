/*-----------------------------------------
Creating Controller for Address and Account Part of User

Basically we will have 4 address
1 - Add Address
2 - Fetching Address
3 - Edit Address
4 - Delete Address
------------------------------------------*/
const Address = require('../../models/address.model')


/*-----------------------------------------
Writing Controller for Adding Address
------------------------------------------*/
const addAddress = async (req, res) => {
    try {

        //Getting userId, address, city, pincode, number which is we mention in our Model/Schemas of Address
        const { userId, address, city, pincode, phone, notes } = req.body

        //If Faild to get any of above field
        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        //If we get all fields -- Then create address for user
        const newlyCreatedAddress = new Address({ userId, address, city, pincode, phone, notes })

        await newlyCreatedAddress.save()

        res.status(201).json({
            success: true,
            data: newlyCreatedAddress,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}



/*-----------------------------------------
Writing Controller for Fetching Address
------------------------------------------*/
const fetchAddress = async (req, res) => {
    try {

        //For Fetching Address of User -- We need userId and we are fetching user if from params
        const { userId } = req.params;

        //If Failed to get userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required!",
            });
        }

        //Finding userId from Databasse
        const addressList = await Address.find({ userId }); // ✅ rename variable

        res.status(200).json({
            success: true,
            data: addressList, // ✅ now defined
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured",
        });
    }
};




/*-----------------------------------------
Writing Controller for Updating Address
------------------------------------------*/
const editAddress = async (req, res) => {
    try {

        //For editing address -- We require userId and addressid
        const { userId, addressId } = req.params
        const formData = req.body

        //if we dont get above mentioned field
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id is required!",
            });
        }

        //Findind address from database
        const address = await Address.findOneAndUpdate({
            _id: addressId, userId
        }, formData, { new: true })

        //If We dont find any address
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            data: address,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}



/*-----------------------------------------
Writing Controller for Delete Address
------------------------------------------*/
const deleteAddress = async (req, res) => {
    try {

        //For deleting address -- We require userId and addressid
        const { userId, addressId } = req.params

        //if we dont get above mentioned field
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id is required!",
            });
        }

        //Deleting The Address
        const address = await Address.findOneAndDelete({
            _id: addressId, userId
        })

        //If We dont find any address
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })
    }
}


module.exports = { addAddress, fetchAddress, editAddress, deleteAddress }
