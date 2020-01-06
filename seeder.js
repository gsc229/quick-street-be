const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Load models
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const vendors = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/vendors.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

// Import into DB 
const importData = async () => {
  try {
    await Vendor.create(vendors);
    await Product.create(products);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error('import error', err);
  }
}

// Delete data 
const deleteData = async () => {
  try {
    await Vendor.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}


