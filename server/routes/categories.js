require('dotenv').config();

const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

cloudinary.config({
    cloud_name: process.env.Cloudinary_Config_Cloud_Name,
    api_key: process.env.Cloudinary_Config_api_key,
    api_secret: process.env.Cloudinary_Config_api_secret
})

// GET: Fetch all categories

router.get('/', async (req, res) => {
    const categoryList = await Category.find({});
    
    if (!categoryList) {
        res.status(500).json({ success: false, message: 'Category not found' });
    }
    res.send(categoryList);
})

// GET: Fetch a specific category by ID

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
        res.status(500).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).send(category);
})

// DELETE: Remove category by ID

router.delete('/:id', async (req, res) => {
    const deletedUser = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
        res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.status(200).json({ success: true, message: 'Category deleted successfully' }); 
})

// PUT: Update category by ID

router.put('/:id', async (req, res) => {
    
    const limit = pLimit(2);

    if (!Array.isArray(req.body.images)) {
        return res.status(400).json({ success: false, message: 'Images must be an array.' });
    }
    
    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        })
    })
    
    const uploadStatus = await Promise.all(imagesToUpload);
    
    const imgurl = uploadStatus.map((item) => {
        return item.secure_url
    })
    
    if (!uploadStatus) {
        return res.status(500).json({ success: false, message: 'Image cannot be uploaded' });
    }
    
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            images: imgurl
        },
        { new: true }
    )
    
    if (!category) {
        res.status(500).json({ success: false, message: 'Category cannot be updated' });
    }
    
    res.send(category);
})

// POST: Create a new category with images

router.post('/create', async (req, res) => {
    
    const limit = pLimit(2);
    
    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        })
    })
    
    const uploadStatus = await Promise.all(imagesToUpload);
    
    const imgurl = uploadStatus.map((item)=>{
        return item.secure_url
    })
    
    if(!uploadStatus){
        return res.status(500).json({
            error:"image cannot be uploaded!",
            status:false
            });
    }
    
    let category = new Category({
        name: req.body.name,
        images: imgurl
    })
    
    if (!category) {
        res.status(500).json({
            error:err,
            status:false
        })
    }
    
    category = await category.save();
    
    res.status(201).json(category);
})
 

module.exports = router;
 