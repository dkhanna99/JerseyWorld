
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    attributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductAttributePrice', 
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    }
});

const ShoppingCartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);