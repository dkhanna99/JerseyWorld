const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');
const { Product } = require('../models/products');
const ProductVariant = require('../models/ProductVariant');

// GET : Fetch cart by cartId with populated product and variant details
router.get('/:cartId', async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ cartId: req.params.cartId })
            .populate({
                path: 'items.productId',
                select: 'name description image basePrice hasVariants availableColors availableSizes'
            })
            .populate({
                path: 'items.attributeId',
                select: 'color size price stock sku'
            });
        
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST : Add/Update cart by cartId
router.post('/', async (req, res) => {
    const { cartId, items } = req.body;
    
    try {
        // Validate items and get proper pricing
        const validatedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            let finalPrice = product.basePrice;
            let attributeId = null;

            // If product has variants and variant is specified
            if (product.hasVariants && item.attributeId) {
                const variant = await ProductVariant.findById(item.attributeId);
                if (variant && variant.productId.toString() === item.productId) {
                    finalPrice = variant.price;
                    attributeId = variant._id;
                } else {
                    throw new Error(`Invalid variant for product: ${item.productId}`);
                }
            }

            return {
                productId: item.productId,
                attributeId: attributeId,
                quantity: item.quantity,
                price: finalPrice
            };
        }));

        const updatedCart = await ShoppingCart.findOneAndUpdate(
            { cartId },
            { cartId, items: validatedItems },
            { upsert: true, new: true }
        ).populate({
            path: 'items.productId',
            select: 'name description image basePrice hasVariants availableColors availableSizes'
        }).populate({
            path: 'items.attributeId',
            select: 'color size price stock sku'
        });

        res.json(updatedCart);
    } catch (err) {
        console.error('Cart update error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT : Update specific item in cart
router.put('/:cartId/item/:itemIndex', async (req, res) => {
    const { cartId, itemIndex } = req.params;
    const { quantity, attributeId } = req.body;

    try {
        const cart = await ShoppingCart.findOne({ cartId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        if (itemIndex >= cart.items.length) {
            return res.status(400).json({ message: 'Invalid item index' });
        }

        const item = cart.items[itemIndex];
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        let finalPrice = product.basePrice;
        let finalAttributeId = null;

        // If product has variants and variant is specified
        if (product.hasVariants && attributeId) {
            const variant = await ProductVariant.findById(attributeId);
            if (variant && variant.productId.toString() === item.productId.toString()) {
                finalPrice = variant.price;
                finalAttributeId = variant._id;
            } else {
                return res.status(400).json({ message: 'Invalid variant for product' });
            }
        }

        // Update the item
        cart.items[itemIndex] = {
            ...item,
            quantity: quantity || item.quantity,
            attributeId: finalAttributeId,
            price: finalPrice
        };

        await cart.save();

        const updatedCart = await ShoppingCart.findOne({ cartId })
            .populate({
                path: 'items.productId',
                select: 'name description image basePrice hasVariants availableColors availableSizes'
            })
            .populate({
                path: 'items.attributeId',
                select: 'color size price stock sku'
            });

        res.json(updatedCart);
    } catch (err) {
        console.error('Cart item update error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE : Remove specific item from cart
router.delete('/:cartId/item/:itemIndex', async (req, res) => {
    const { cartId, itemIndex } = req.params;

    try {
        const cart = await ShoppingCart.findOne({ cartId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        if (itemIndex >= cart.items.length) {
            return res.status(400).json({ message: 'Invalid item index' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        const updatedCart = await ShoppingCart.findOne({ cartId })
            .populate({
                path: 'items.productId',
                select: 'name description image basePrice hasVariants availableColors availableSizes'
            })
            .populate({
                path: 'items.attributeId',
                select: 'color size price stock sku'
            });

        res.json(updatedCart);
    } catch (err) {
        console.error('Cart item delete error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE : Clear entire cart
router.delete('/:cartId', async (req, res) => {
    try {
        const cart = await ShoppingCart.findOneAndDelete({ cartId: req.params.cartId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json({ message: 'Cart cleared successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;