require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./models/products');
const { Category } = require('./models/category');

mongoose.connect(process.env.CONNECTION_STRING)
    .then(async () => {
        const bestSellers = await Category.findOne({ name: 'Best Sellers' });
        if (!bestSellers) {
            console.log("❌ 'Best Sellers' category not found.");
            return process.exit();
        }

        const otherCategories = await Category.find({ _id: { $ne: bestSellers._id } });

        for (let cat of otherCategories) {
            const product = await Product.findOne({ category: cat._id });
            if (product) {
                
                const bestSeller = new Product({
                    ...product.toObject(),
                    _id: new mongoose.Types.ObjectId(),
                    isNew: true,
                    category: bestSellers._id
                });

                await bestSeller.save();
                console.log(`✅ Added '${bestSeller.name}' to Best Sellers`);
            }
        }

        process.exit();
    })
    .catch(err => console.error(err));