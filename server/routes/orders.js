const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ShoppingCart = require('../models/ShoppingCart');

const generateOrderNumber = () => 'ORD-' + Math.floor(Math.random() * 1000000);

router.post('/', async (req, res) => {
    const { cartId, shopperName, email, phone } = req.body;

    try {
        const cart = await ShoppingCart.findOne({ cartId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        console.log('[CART FOUND]', cart);

        const order = new Order({
            orderNumber: generateOrderNumber(),
            shopperName,
            email,
            phone,
            items: cart.items.map(item => ({
                productId: item.productId?._id || item.productId, 
                attributeId: item.attributeId?._id || item.attributeId,
                quantity: item.quantity,
                price: item.price
            }))
        });

        await order.save().catch(err => {
            console.error('Save failed:', err.errors || err.message);
            throw err;
        });
        
        await ShoppingCart.deleteOne({ cartId });

        res.json({ message: 'Order placed!', orderNumber: order.orderNumber });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'items.productId',
                select: 'name description image'
            })
            .populate({
                path: 'items.attributeId',
                select: 'color size price'
            })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;