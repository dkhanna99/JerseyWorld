const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');
const { Category } = require('../models/category');
const ProductVariant = require('../models/ProductVariant');

// POST: Admin creates a product (no cloudinary image support)
router.post('/', async (req, res) => {
    const { 
        name, 
        description, 
        image, 
        basePrice, 
        rating, 
        category, 
        isFeatured, 
        hasVariants, 
        availableColors, 
        availableSizes, 
        variants 
    } = req.body;

    const cat = await Category.findById(category);
    if (!cat) return res.status(404).send("Category not found");

    try {
        const product = new Product({
            name,
            description,
            image: Array.isArray(image) ? image : [image],
            basePrice,
            rating,
            category,
            isFeatured,
            hasVariants,
            availableColors: availableColors || [],
            availableSizes: availableSizes || []
        });

        const savedProduct = await product.save();

        // If product has variants, create them
        if (hasVariants && variants && variants.length > 0) {
            const variantPromises = variants.map(variant => {
                const productVariant = new ProductVariant({
                    productId: savedProduct._id,
                    color: variant.color,
                    size: variant.size,
                    price: variant.price,
                    stock: variant.stock
                });
                return productVariant.save();
            });

            await Promise.all(variantPromises);
        }

        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Admin deletes a product
router.delete('/:id', async (req, res) => {
    try {
        // Delete associated variants first
        await ProductVariant.deleteMany({ productId: req.params.id });
        
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