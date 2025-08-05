const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const { Product } = require('../models/products');

// GET : Dashboard data with comprehensive metrics
router.get('/dashboard', async (req, res) => {
    try {
        // Get current date and calculate date ranges
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch all data
        const [orders, carts, contacts, products] = await Promise.all([
            Order.find().populate('items.productId', 'name image'),
            ShoppingCart.find({ $expr: { $gt: [{ $size: "$items" }, 0] } }),
            Contact.find().sort({ createdAt: -1 }),
            Product.find()
        ]);

        // Calculate metrics
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        const todayOrders = orders.filter(order => order.createdAt >= today);
        const weekOrders = orders.filter(order => order.createdAt >= weekAgo);
        const monthOrders = orders.filter(order => order.createdAt >= monthAgo);

        const todayRevenue = todayOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        const weekRevenue = weekOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        const monthRevenue = monthOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        const unreadMessages = contacts.filter(contact => contact.status === 'unread').length;

        // Get recent orders (last 10)
        const recentOrders = orders.slice(0, 10).map(order => ({
            id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.shopperName,
            total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: order.createdAt,
            itemCount: order.items.length
        }));

        // Get recent messages (last 5)
        const recentMessages = contacts.slice(0, 5).map(contact => ({
            id: contact._id,
            name: contact.name,
            email: contact.email,
            message: contact.message.substring(0, 100) + (contact.message.length > 100 ? '...' : ''),
            status: contact.status,
            date: contact.createdAt
        }));

        // Get products without images
        const productsWithoutImages = products.filter(product => 
            !product.image || product.image.length === 0
        ).length;

        // Get featured products count
        const featuredProducts = products.filter(product => product.isFeatured).length;

        const dashboardData = {
            metrics: {
                totalRevenue: totalRevenue.toFixed(2),
                todayRevenue: todayRevenue.toFixed(2),
                weekRevenue: weekRevenue.toFixed(2),
                monthRevenue: monthRevenue.toFixed(2),
                totalOrders: orders.length,
                todayOrders: todayOrders.length,
                weekOrders: weekOrders.length,
                monthOrders: monthOrders.length,
                activeCarts: carts.length,
                totalProducts: products.length,
                unreadMessages,
                productsWithoutImages,
                featuredProducts
            },
            recentOrders,
            recentMessages,
            chartData: {
                // Revenue for last 7 days
                dailyRevenue: await getDailyRevenue(7),
                // Orders for last 7 days
                dailyOrders: await getDailyOrders(7)
            }
        };

        res.json(dashboardData);
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Helper function to get daily revenue for chart
async function getDailyRevenue(days) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const dayOrders = await Order.find({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        const dayRevenue = dayOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        data.push({
            date: startOfDay.toISOString().split('T')[0],
            revenue: dayRevenue
        });
    }
    return data;
}

// Helper function to get daily orders for chart
async function getDailyOrders(days) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const dayOrders = await Order.find({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        data.push({
            date: startOfDay.toISOString().split('T')[0],
            orders: dayOrders.length
        });
    }
    return data;
}

// GET : Fetch all active shopping carts (excluding empty carts)
router.get('/carts', async (req, res) => {
    try {
        const carts = await ShoppingCart.find({
            $expr: { $gt: [{ $size: "$items" }, 0] } // Only carts with items
        })
            .populate({
                path: 'items.productId',
                select: 'name description image'
            })
            .populate({
                path: 'items.attributeId',
                select: 'color size price'
            })
            .sort({ createdAt: -1 });
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET : Fetch all completed orders with populated product details
router.get('/orders', async (req, res) => {
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