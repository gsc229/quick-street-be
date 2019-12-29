const mongoose = require('mongoose');

const Product_Schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a product name']
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    diet: {
        type: [String],
        enum: ['Gluten Free', 'Vegetarian', 'Vegan', 'Keto', 'Dairy Free']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price for this product']
    },
    product_image: {
        type: String,
        default: 'no-photo.jpg'
      },
      createdAt: {
          type: Date,
          default: Date.now
      },
      vendor: {
          type: mongoose.Schema.ObjectId,
          ref: 'Vendor',
          required: true
      }
});

module.exports = mongoose.model('Product', Product_Schema);