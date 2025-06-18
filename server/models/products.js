const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [
        {
        type: String,
        required: true,
    }
    ],
    price: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    }
    
})

exports.Product = mongoose.model("Product", productSchema);