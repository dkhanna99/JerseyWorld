
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ShoppingCart = require('../models/ShoppingCart');

// Helper to generate unique order numbers
const generateOrderNumber = () => 'ORD-' + Math.floor(Math.random() * 1000000);

// Checkout endpoint
// POST : Create a new order

router.post('/', async (req, res) => {
    const { cartId, shopperName } = req.body;

    try {
        const cart = await ShoppingCart.findOne({ cartId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const order = new Order({
            orderNumber: generateOrderNumber(),
            shopperName,
            items: cart.items
        });

        await order.save();
        await ShoppingCart.deleteOne({ cartId }); // Clear cart after checkout

        res.json({ message: 'Order placed!', orderNumber: order.orderNumber });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (Admin) GET : list all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;