const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const Vendor_Schema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  phone: {
    type: String
  },
  zipcode: {
    type: String,
    //required: [true, 'Please add a zipcode']
  },
  business_name: {
    type: String,
    unique: true
  },
  slug: String,
  description: {
    type: String
  },
  avatar: {
    type: String,
    default: 'no-photo.jpg'
  },
  vendor_banner: {
    type: String,
    default: 'no-photo.jpg'
  },
  vendor_category: {
    type: [String],
    enum: [
      "Vegetables",
      "Fruits",
      "Breads",
      "Baked goods",
      "Beverages",
      "Spreads",
      "Other"
    ]
  },
  created_at: {
    type: Date
  },
  address: {
    type: String
  },
  //vendor location
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  //Vendor bulletin
  bulletin: String,
  created_at: {
    type: Date,
    default: Date.now
  }

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }

});

// ===== hooks ========

// Encrypt password using bcrypt
Vendor_Schema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



// Create a 'slug' based on business_name for fontend to make routes
Vendor_Schema.pre('save', function (next) {
  this.slug = slugify(this.business_name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g
  });
  next();
});

Vendor_Schema.pre('validate', async function (next) {

  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a 'slug' based on business_name for fontend to make routes
Vendor_Schema.pre('save', function (next) {
  this.slug = slugify(this.business_name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g
  });
  next();
});

//Geocode & create location field
Vendor_Schema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  //Do not save address in the DB
  this.address = undefined;
  next();
})

// Match user entered password to hashed password in database
Vendor_Schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete other objects related to vendor
Vendor_Schema.pre('remove', async function (next) {
  console.log(`Products being deleted from vendor ${this._id}`)
  await this.model('Product').deleteMany({
    vendor: this._id
  })
  next();
})

// Reverse populate with virtuals 
/* Vendor_Schema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false
}); */

module.exports = mongoose.model('Vendor', Vendor_Schema);
