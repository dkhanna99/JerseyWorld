require('dotenv').config(); 

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

// Middleware
app.use(cors());
//app.options("/*", cors());
app.use(bodyParser.json());

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use(`/api/category`, categoryRoutes);
app.use(`/api/products`, productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB Connected');
    // Server
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    }); 
})
.catch((err) => {
    console.error(err);
})
