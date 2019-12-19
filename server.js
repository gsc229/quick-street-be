const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const logger = require('./middleware/logger');

// Route files
const vendors = require('./routes/vendors');

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount Routers
app.use('/api/v1.0/vendors', vendors);

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
