
const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');

// GET : Fetch cart by cartId

router.get('/:cartId', async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ cartId: req.params.cartId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST : Add cart by cartId
router.post('/', async (req, res) => {
    const { cartId, items } = req.body;
    try {
        const updatedCart = await ShoppingCart.findOneAndUpdate(
            { cartId },
            { cartId, items },
            { upsert: true, new: true }
        );
        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;