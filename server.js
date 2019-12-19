const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
// Route files
const vendors = require('./routes/vendors');

const app = express();

// Load env vars
dotenv.config({ path: './config/config.env' });


// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(logger);
}



// Mount Routers
app.use('/api/v1.0/vendors', vendors);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold));