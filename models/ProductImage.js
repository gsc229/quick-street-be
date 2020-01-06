const mongoose = require('mongoose');

const Product_Image = new mongoose.Schema({

  public_id: String,
  version: Number,
  signature: String,
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
  created_at: String,
  tags: [String],
  bytes: Number,
  type: String,
  etag: String,
  placeholder: Boolean,
  url: String,
  secure_url: String,
  access_mode: String,
  original_filename: String,
  path: String,
  thumbnail_url: String,
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true
  }

});

module.exports = mongoose.model('ProductImage', Product_Image);