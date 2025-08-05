
require('dotenv').config();
const mongoose = require('mongoose');
const { Category } = require('./models/category');
console.log("Category type:", typeof Category);
mongoose.connect(process.env.CONNECTION_STRING)
    .then(async () => {
        const existing = await Category.findOne({ name: 'Best Sellers' });
        if (existing) {
            console.log("Category already exists.");
            return;
        }

        const bestSellers = new Category({ name: 'Best Sellers' });
        await bestSellers.save();
        console.log("✅ 'Best Sellers' category created.");
        process.exit();
    })
    .catch(err => console.error(err));