const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure unique combinations of product, color, and size
ProductVariantSchema.index({ productId: 1, color: 1, size: 1 }, { unique: true });

// Generate SKU automatically
ProductVariantSchema.pre('save', function(next) {
    if (!this.sku) {
        this.sku = `${this.productId.toString().slice(-6)}-${this.color.slice(0, 3).toUpperCase()}-${this.size.toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('ProductVariant', ProductVariantSchema);