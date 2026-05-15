//Creating routes for uploading files
const express = require("express")

//Getting Controller
const { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct } = require("../../controllers/admin/products.controller")

//Getting upload function -- where iamges is stores using local server
const { upload } = require("../../helpers/cloudinary")

const router = express.Router()

//Creating route to upload images
// router.post("/upload-image", upload.single("my_file"), handleImageUpload, (req, res) => {
//     if (!req.file) {
//         return res.json({
//             success: false,
//             message: "No file uploaded"
//         });
//     }

//     return res.json({
//         success: true,
//         message: "Image uploaded successfully"
//     });
// });
router.post(
  "/upload-image",
  upload.single("my_file"),
  handleImageUpload
);

//Creating route for Add Products
router.post('/add', addProduct)

//Creating route for Edit Products.. aldo putting id after endpont because .. for editing we will get product by its id
router.put('/edit/:id', editProduct)

//Creating route for Delete Products.. aldo putting id after endpont because .. for deleting we will get product by its id
router.delete('/delete/:id', deleteProduct)

//Creating router to get list of products
router.get('/get', fetchAllProducts)



module.exports = router