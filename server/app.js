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

app.use(`/api/category`, categoryRoutes);
app.use(`/api/products`, productRoutes);

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
