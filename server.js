const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const vendors = require('./routes/vendors');
const customers = require('./routes/customers');
const products = require('./routes/products');
const cart = require('./routes/cart');
const productImages = require('./routes/productImages');
const posts = require('./routes/posts');
const orders = require('./routes/order');

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// File uploading

app.use(fileupload());

// Mount Routers
app.use('/api/v1.0/auth', auth);
app.use('/api/v1.0/vendors', vendors);
app.use('/api/v1.0/customers', customers);
app.use('/api/v1.0/products', products);
app.use('/api/v1.0/cart', cart);
app.use('/api/v1.0/product-images', productImages);
app.use('/api/v1.0/posts', posts);
app.use('/api/v1.0/orders', orders);

// Make public a static folder (you can access the photos through the URL in browser)
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

app.get('/test', (req, res) => {
  res.send(
    '<h1>Server Status</h1><h2>Server running succesfully.</h2><p>Deployment is all good, continue working.. nothing to see here.</p>'
  );
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
});
