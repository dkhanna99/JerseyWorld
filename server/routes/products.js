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

// GET: Fetch a specific Product by ID with variants
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // If product has variants, fetch them
        let variants = [];
        if (product.hasVariants) {
            variants = await ProductVariant.find({ 
                productId: req.params.id,
                isActive: true 
            });
        }

        const productWithVariants = {
            ...product.toObject(),
            variants: variants
        };

        return res.status(200).send(productWithVariants);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Create a new product with images
router.post('/create', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Base price from request:', req.body.basePrice, 'Type:', typeof req.body.basePrice);
        
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(404).send("Category not found");

        // Validate images
        if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).json({ error: "Images are required and must be an array", status: false });
        }

        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) =>
            limit(async () => cloudinary.uploader.upload(image))
        );

        const uploadStatus = await Promise.all(imagesToUpload);
        if (!uploadStatus) {
            return res.status(500).json({ error: "image cannot be uploaded!", status: false });
        }

        const imgurl = uploadStatus.map(item => item.secure_url);

        // Parse and validate basePrice
        const basePrice = parseFloat(req.body.basePrice);
        if (isNaN(basePrice) || basePrice < 0) {
            return res.status(400).json({ error: "Invalid base price", status: false });
        }

        console.log('Parsed base price:', basePrice);

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            image: imgurl,
            basePrice: basePrice,
            rating: req.body.rating,
            category: req.body.category,
            isFeatured: req.body.isFeatured,
            hasVariants: req.body.hasVariants || false,
            availableColors: req.body.availableColors || [],
            availableSizes: req.body.availableSizes || []
        });

        console.log('Product object before save:', product);

        product = await product.save();
        console.log('Product saved with basePrice:', product.basePrice);
        
        if (!product) {
            return res.status(500).json({ success: false });
        }

        // If product has variants, create them
        if (req.body.hasVariants && req.body.variants && req.body.variants.length > 0) {
            console.log('Creating variants:', req.body.variants);
            
            const variantPromises = req.body.variants.map((variant, index) => {
                // Manually generate SKU with better uniqueness
                const productIdSuffix = product._id.toString().slice(-6);
                
                // Handle hex colors and regular color names
                let colorPrefix;
                if (variant.color.startsWith('#')) {
                    // For hex colors, use the hex value without #
                    colorPrefix = variant.color.slice(1, 4).toUpperCase();
                } else {
                    // For color names, use first 3 characters
                    colorPrefix = variant.color.slice(0, 3).toUpperCase();
                }
                
                const sizeUpper = variant.size.toUpperCase();
                const sku = `${productIdSuffix}-${colorPrefix}-${sizeUpper}-${index + 1}`;
                
                // Parse and validate variant price
                const variantPrice = parseFloat(variant.price);
                if (isNaN(variantPrice) || variantPrice < 0) {
                    throw new Error(`Invalid price for variant ${index + 1}: ${variant.price}`);
                }
                
                console.log('Creating variant with SKU:', sku, 'for color:', variant.color, 'size:', variant.size, 'price:', variantPrice);
                
                const productVariant = new ProductVariant({
                    productId: product._id,
                    color: variant.color,
                    size: variant.size,
                    price: variantPrice,
                    stock: variant.stock,
                    sku: sku
                });
                return productVariant.save();
            });

            try {
                const savedVariants = await Promise.all(variantPromises);
                console.log('Variants created successfully:', savedVariants.map(v => ({ sku: v.sku, price: v.price })));
            } catch (variantError) {
                console.error('Error creating variants:', variantError);
                // Delete the product if variant creation fails
                await Product.findByIdAndDelete(product._id);
                return res.status(500).json({ error: "Failed to create variants: " + variantError.message, status: false });
            }
        }

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message, status: false });
    }
});

// PUT: Update Product by ID
router.put('/:id', async (req, res) => {
    try {
        console.log('Update request body:', req.body);
        console.log('Base price from update request:', req.body.basePrice, 'Type:', typeof req.body.basePrice);
        
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(404).send("Category not found");

        // Validate images
        if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).json({ error: "Images are required and must be an array", status: false });
        }

        // Separate existing images (URLs) from new images (base64)
        const existingImages = req.body.images.filter(img => img.startsWith('http'));
        const newImages = req.body.images.filter(img => !img.startsWith('http'));

        let imgurl = [...existingImages];

        // Upload new images if any
        if (newImages.length > 0) {
            const limit = pLimit(2);
            const imagesToUpload = newImages.map((image) =>
                limit(async () => cloudinary.uploader.upload(image))
            );

            const uploadStatus = await Promise.all(imagesToUpload);
            if (!uploadStatus) {
                return res.status(500).json({ error: "New images cannot be uploaded!", status: false });
            }

            const newImageUrls = uploadStatus.map(item => item.secure_url);
            imgurl = [...existingImages, ...newImageUrls];
        }

        // Parse and validate basePrice
        const basePrice = parseFloat(req.body.basePrice);
        if (isNaN(basePrice) || basePrice < 0) {
            return res.status(400).json({ error: "Invalid base price", status: false });
        }

        console.log('Parsed base price for update:', basePrice);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                image: imgurl,
                basePrice: basePrice,
                rating: req.body.rating,
                category: req.body.category,
                isFeatured: req.body.isFeatured,
                hasVariants: req.body.hasVariants || false,
                availableColors: req.body.availableColors || [],
                availableSizes: req.body.availableSizes || []
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product cannot be updated' });
        }

        // Update variants if provided
        if (req.body.hasVariants && req.body.variants) {
            // Delete existing variants
            await ProductVariant.deleteMany({ productId: req.params.id });
            
            // Create new variants
            if (req.body.variants.length > 0) {
                console.log('Creating variants for update:', req.body.variants);
                
                const variantPromises = req.body.variants.map((variant, index) => {
                    // Manually generate SKU with better uniqueness
                    const productIdSuffix = product._id.toString().slice(-6);
                    
                    // Handle hex colors and regular color names
                    let colorPrefix;
                    if (variant.color.startsWith('#')) {
                        // For hex colors, use the hex value without #
                        colorPrefix = variant.color.slice(1, 4).toUpperCase();
                    } else {
                        // For color names, use first 3 characters
                        colorPrefix = variant.color.slice(0, 3).toUpperCase();
                    }
                    
                    const sizeUpper = variant.size.toUpperCase();
                    const sku = `${productIdSuffix}-${colorPrefix}-${sizeUpper}-${index + 1}`;
                    
                    // Parse and validate variant price
                    const variantPrice = parseFloat(variant.price);
                    if (isNaN(variantPrice) || variantPrice < 0) {
                        throw new Error(`Invalid price for variant ${index + 1}: ${variant.price}`);
                    }
                    
                    console.log('Creating variant with SKU:', sku, 'for color:', variant.color, 'size:', variant.size, 'price:', variantPrice);
                    
                    const productVariant = new ProductVariant({
                        productId: product._id,
                        color: variant.color,
                        size: variant.size,
                        price: variantPrice,
                        stock: variant.stock,
                        sku: sku
                    });
                    return productVariant.save();
                });

                try {
                    const savedVariants = await Promise.all(variantPromises);
                    console.log('Variants updated successfully:', savedVariants.map(v => ({ sku: v.sku, price: v.price })));
                } catch (variantError) {
                    console.error('Error updating variants:', variantError);
                    return res.status(500).json({ error: "Failed to update variants: " + variantError.message, status: false });
                }
            }
        } else {
            // If product no longer has variants, delete existing variants
            await ProductVariant.deleteMany({ productId: req.params.id });
        }

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message, status: false });
    }
});

// DELETE: Remove Product by ID
router.delete('/:id', async (req, res) => {
    try {
        // Delete associated variants first
        await ProductVariant.deleteMany({ productId: req.params.id });
        
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deleteProduct) {
            return res.status(404).json({ message: "Product not found!", status: false });
        }
        res.status(200).send({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
});

module.exports = router;