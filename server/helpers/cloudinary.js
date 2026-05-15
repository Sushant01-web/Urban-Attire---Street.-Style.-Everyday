// //Writing code to get images from cloudinary
const cloudinary = require("cloudinary").v2;

// //Getting multer to store images temporary on our local server
const multer = require("multer");

cloudinary.config({
    cloud_name: "dzs5homzs",
    api_key: "717536266958999",
    api_secret: "Y_R-KI7ivJ_3CcgEp9Tava15eLg"
});

//Creating Funtion to transfering images from local to server
const storage = new multer.memoryStorage();

//Uploading image to cloud
async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });

    return result;
}

//Creating storage for storing multer
const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };