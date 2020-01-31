const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const crypto = require('crypto');


const Customer_Schema = new mongoose.Schema(
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
    first_name: {
        type: String,
    },
    last_name: {
        type: String, 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,  
    avatar: {
        type: String,
        default: 'no-photo.jpg'
  },
    created_at: {
        type: Date,
        default: Date.now
  },
  //   history: [{
  //       paid: {
  //           type: Number,
  //           default: 0
  //       },
  //       item: {
  //           type: mongoose.Schema.ObjectId, 
  //           ref: 'Product',
  //           require: true
  //       }
  // }],

}
)

// ===== hooks ========

// Encrypt password using bcrypt
Customer_Schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10); //takes in a number of rounds for protection
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  // Sign JWT and return
  Customer_Schema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRE
    });
  };
  
  // Match user entered password to hashed password in database
  Customer_Schema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Generate and hash password token
  Customer_Schema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex'); //gives us the reset token
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // reseting password to hashed version
  
    // Set expire
    this.resetPasswordToken = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  }
  
  // Create a 'slug' based on first_name for fontend to make routes
  Customer_Schema.pre('save', function (next) {
    this.slug = slugify(`${this.first_name} ${this.last_name}`, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });
    next();
  });


module.exports = mongoose.model('Customer', Customer_Schema);