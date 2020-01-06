const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get products
// @route   GET /api/v1.0/product-images/:productId
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllImages = asyncHandler(async (req, res, next) => {
  let query;
  if (res.advancedResults) {
    res.status(200).json(res.advancedResults);
  } else {
    query = ProductImage.find();

    const images = await query;

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    })
  }


})