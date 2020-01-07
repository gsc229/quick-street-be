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
  if (req.params.productId) {
    query = ProductImage.find({
      product: req.params.productId
    })
    const productImages = await query;

    res.status(200).json({
      success: true,
      count: productImages.length,
      data: productImages
    });
  } else if (req.params.vendorId) {

    query = ProductImage.find({
      vendor: req.params.vendorId
    })

    const productImages = await query;

    res.status(200).json({
      success: true,
      count: productImages.length,
      data: productImages
    })

  } else {
    res.status(200).json(res.advancedResults)
  }


})