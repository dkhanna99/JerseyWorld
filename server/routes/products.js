const { Category } = require('../models/category');
const { Product } = require('../models/products');
const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

// GET: Fetch all products

router.get('/', async (req, res) => {
    const productList = await Product.find().populate("category");
    
    if (!productList) {
        res.status(500).json({
            success: false,
        })
    }
    res.send(productList);
})

// GET: Fetch a specific Product by ID

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).send(product);
})

// POST: Create a new product with images

router.post('/create', async (req, res) => {
    
    const category = await Category.findById(req.body.category);
    if (!category) {
        res.status(404).send("Category not found");
    }

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
    
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        image: imgurl,
        price: req.body.price,
        rating: req.body.rating,
        category: req.body.category,
        isFeatured: req.body.isFeatured,
    });
    
    product = await product.save();
    if (!product) {
        res.status(500).json({
            success: false,
            error: err
        })
    }
    
    res.status(201).json(product);
})

// PUT: Update Product by ID

router.put('/:id', async (req, res) => {

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
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: imgurl,
            price: req.body.price,
            rating: req.body.rating,
            category: req.body.category,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    )

    if (!product) {
        res.status(404).json({ success: false, message: 'Product cannot be updated' });
    }

    res.status(200).json({
        success: true,
        message: 'Product updated',
    });
})

// DELETE: Remove Product by ID

router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({
            message: "Product not found!",
            status: false
        });
    }
    res.status(200).send({
        success: true,
        message: 'Product deleted successfully'
    })
})


module.exports = router;