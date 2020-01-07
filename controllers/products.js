const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY


// @desc    Get products
// @route   GET /api/v1.0/products
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.vendorId) {
        query = Product.find({
            vendor: req.params.vendorId
        })
        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } else {
        res.status(200).json(res.advancedResults)
    }
});

// @desc    Get a single product
// @route   GET /api/v1.0/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'vendor',
        select: 'business_name description'
    });

    if (!product) {
        return next(new ErrorResponse(`No product with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        count: product.length,
        data: product
    });
});

// @desc    Create a new product
// @route   POST /api/v1.0/vendors/:vendorId/products
// @access  Private
exports.addProduct = asyncHandler(async (req, res, next) => {

    req.body.vendor = req.params.vendorId;
    console.log('Creating new product from vendorId:', req.body.vendor);
    const vendor = await Vendor.findById(req.params.vendorId)
    if (!vendor) {
        return next(
            new ErrorResponse(`No vendor with the id of ${req.params.vendorId}`),
            404
        );
    }

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        data: product
    })

})

// @desc    Update product
// @route   PUT /api/v1.0/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    console.log('Updating product:', req.params.id);
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(
            new ErrorResponse(`No vendor with the id of ${req.params.id}`),
            404
        );
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: product
    });
});


// @desc   Delete product
// @route   DELETE /api/v1.0/vendors/:vendorId/products
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`No product with the id of ${req.params.id}`),
            404
        );
    }

    await product.remove()

    res.status(200).json({
        success: true,
        data: {}
    });
});