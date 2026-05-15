/*----------------------------------
Creating a controller to handle Banner images
-----------------------------------*/
const Feature = require("../../models/features.model")

//1. add feature image
const addFeatureImages = async(req, res)=>{
    try {
        //Getting image from body
        const { image } = req.body

        //saving images
        const featureImages = new Feature({image})

        await featureImages.save()

        res.status(201).json({
            success : true,
            data : featureImages
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occcured"
        })
    }
}


//2. get feature images
const getFeatureImages = async(req, res)=>{
    try {
        const images = await Feature.find({})

        res.status(200).json({
            success : true,
            data : images
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occcured"
        })
    }
}


//3. delete Feature images
const deleteFeatureImages = async(req, res)=>{
    try {
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occcured"
        })
    }
}


module.exports = {addFeatureImages, getFeatureImages, deleteFeatureImages}