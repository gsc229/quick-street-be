const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get product images
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

// @desc    Create a product-image object
// @route   POST /api/v1.0/product-images/:productId
// @access  Private
exports.addPost = asyncHandler(async (req, res, next) => {

  req.body.productImage = req.params.vendorId;
  console.log('Creating new post from vendorId:', req.body.vendor);
  const vendor = await Vendor.findById(req.params.vendorId)
  if (!vendor) {
    return next(
      new ErrorResponse(`No vendor with the id of ${req.params.vendorId}`),
      404
    );
  }

  const post = await Post.create(req.body);
  res.status(200).json({
    success: true,
    data: post
  })

});
