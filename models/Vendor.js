const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const Vendor_Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
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
      minlength: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    phone: {
      type: String
    },
    business_name: {
      type: String,
      unique: true
    },
    hours: {
      type: String,
      default: 'n/a'
    },
    days_of_week: {
      type: String,
      default: 'n/a'
    },
    slug: String,
    description: {
      type: String
    },
    order_details: {
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
        'Vegetables',
        'Fruits',
        'Breads',
        'Baked goods',
        'Beverages',
        'Spreads',
        'Other'
      ]
    },
    diet_categories: {
      type: [String],
      enum: [
        'Gluten Free',
        'Vegetarian',
        'Vegan',
        'Keto',
        'Dairy Free'
      ]
    },
    average_price: {
      type: Number,
      default: 0
    },
    created_at: {
      type: Date,
      default: Date.now
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
    zipcode: String

  },
  { //why are these here? See Note on Reverse Populate over function below.
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ===== hooks ========

// Encrypt password using bcrypt
Vendor_Schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10); //takes in a number of rounds for protection
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
Vendor_Schema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
Vendor_Schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
Vendor_Schema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex'); //gives us the reset token

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // reseting password to hashed version

  // Set expire
  this.resetPasswordToken = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

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
  if (!this.isModified('address')) {
    next();
  }

  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  //Do not save address in the DB
  this.address = undefined;
  this.zipcode = loc[0].zipcode
  next();
});

// Cascade delete other objects related to vendor
Vendor_Schema.pre('remove', async function (next) {
  console.log(`Products being deleted from vendor ${this._id}`);
  await this.model('Product').deleteMany({
    vendor: this._id
  });
  console.log(`Product Images being deleted from vendor ${this._id}`);
  await this.model('ProductImage').deleteMany({
    vendor: this._id
  });
  next();
});

Vendor_Schema.pre('remove', async function (next) {
  console.log(`Posts being deleted from vendor ${this._id}`);
  await this.model('Post').deleteMany({
    vendor: this._id
  });
  next();
});

// Note on Reverse Populate:  with virtual. For every Vendor, this function will attach an array of objects of the Vendor's products. To activate this virtual, do Vendor.find('some query').poplulate('products') at the controller level, or do advancedFilter('Vendors', {path: products}) at the route level.
Vendor_Schema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false
})

Vendor_Schema.virtual('images', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false
})



module.exports = mongoose.model('Vendor', Vendor_Schema);
