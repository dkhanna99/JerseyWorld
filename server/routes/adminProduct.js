
const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');
const { Category } = require('../models/category');

// POST: Admin creates a product (no cloudinary image support)
router.post('/', async (req, res) => {
    const { name, description, image, price, rating, category, isFeatured } = req.body;

    const cat = await Category.findById(category);
    if (!cat) return res.status(404).send("Category not found");

    try {
        const product = new Product({
            name,
            description,
            image: [image],
            price,
            rating,
            category,
            isFeatured
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Admin deletes a product
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;