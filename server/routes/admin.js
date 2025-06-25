
const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');
const Order = require('../models/Order');

// GET : Fetch all active shopping carts
router.get('/carts', async (req, res) => {
    try {
        const carts = await ShoppingCart.find().sort({ createdAt: -1 });
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET : Fetch all completed orders (for redundancy; same as /api/orders)
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;