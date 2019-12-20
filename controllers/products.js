const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY


// @desc    Get products
// @route   GET /api/v1.0/products
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    let query;
    if(req.params.vendorId) {
        query = Product.find({
            vendor: req.params.vendorId
        })
    } else {
        query = Product.find();
    }

    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});