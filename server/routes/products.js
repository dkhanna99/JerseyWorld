const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');
const { Product } = require('../models/products');
const ProductVariant = require('../models/ProductVariant');
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

// GET: Fetch all products
router.get('/', async (req, res) => {
    const productList = await Product.find().populate("category");
    if (!productList) {
        return res.status(500).json({ success: false });
    }
    res.send(productList);
});

// GET: Search products with AND logic
router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Missing search query' });

    const terms = query.trim().toLowerCase().split(/\s+/);
    try {
        const products = await Product.find().populate("category").lean();
        const variants = await ProductVariant.find().lean();

        const results = products.filter(product => {
            const textFields = [
                product.name || '',
                product.description || '',
                product.category?.name || ''
            ];

            // Add variant sizes for this product
            variants
                .filter(v => v.productId.toString() === product._id.toString())
                .forEach(v => textFields.push(v.size));

            const combinedText = textFields.join(' ').toLowerCase();
            return terms.every(term => combinedText.includes(term));
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch a specific Product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).send(product);
});

// POST: Create a new product with images
router.post('/create', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(404).send("Category not found");

    const limit = pLimit(2);
    const imagesToUpload = req.body.images.map((image) =>
        limit(async () => cloudinary.uploader.upload(image))
    );

    const uploadStatus = await Promise.all(imagesToUpload);
    if (!uploadStatus) {
        return res.status(500).json({ error: "image cannot be uploaded!", status: false });
    }

    const imgurl = uploadStatus.map(item => item.secure_url);

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
        return res.status(500).json({ success: false });
    }

    res.status(201).json(product);
});

// PUT: Update Product by ID
router.put('/:id', async (req, res) => {
    const limit = pLimit(2);
    const imagesToUpload = req.body.images.map((image) =>
        limit(async () => cloudinary.uploader.upload(image))
    );

    const uploadStatus = await Promise.all(imagesToUpload);
    if (!uploadStatus) {
        return res.status(500).json({ error: "image cannot be uploaded!", status: false });
    }

    const imgurl = uploadStatus.map(item => item.secure_url);

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: imgurl,
            price: req.body.price,
            rating: req.body.rating,
            category: req.body.category,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    );

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product cannot be updated' });
    }

    res.status(200).json({ success: true, message: 'Product updated' });
});

// DELETE: Remove Product by ID
router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({ message: "Product not found!", status: false });
    }
    res.status(200).send({ success: true, message: 'Product deleted successfully' });
});

module.exports = router;