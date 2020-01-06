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
  console.log("HELLO!");
  res.status(200).json({ message: "HELLO!" });


})