const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


dotenv.config({ path: './config/config.env' });

const Vendors = require('./models/Vendors');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const vendors = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/vendors.json`, 'utf-8')
);

// Import into DB 
const importData = async () => {
  try {
    await Vendors.create(vendors);
    console.log('Data Imported'.green.inverse);
  } catch (err) {
    console.error(err);
  }
}

// Delete data 
const deleteData = async () => {
  try {
    await Vendors.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}