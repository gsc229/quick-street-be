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
// @route   POST /api/v1.0/products/:productId/product-images
// @access  Private
exports.addImage = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  console.log('Creating new productImage from productId:', req.body.product);
  const product = await Product.findById(req.params.productId)
  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.productId}`),
      404
    );
  }

  const image = await ProductImage.create(req.body);
  res.status(200).json({
    success: true,
    data: image
  })

});

// @desc    Delete post
// @route   DELETE /api/v1.0/product-images/:imageId
// @access  Private
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const image = await ProductImage.findById(req.params.imageId);

  if (!image) {
    return next(new ErrorResponse(`No image with the id of ${req.params.imageId}`),
      404
    );
  }

  await image.remove()

  res.status(200).json({
    success: true,
    data: {}
  });
});
