const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY
const geocoder = require('../utils/geocoder');

// @desc    Get products
// @route   GET /api/v1.0/products
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    let query;
    //why Object.entries? An empty object still returns true
    // if there's not a vendorId parameter or there is but it has a query string...
    if (!req.params.vendorId || Object.entries(req.query).length) {
        // respond with the advanced results from adv.R middleware, else it is a normal query.
        res.status(200).json(res.advancedResults)
    } else {
        query = Product.find({
            vendor: req.params.vendorId
        })
        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    }
});

// @desc    Get a single product
// @route   GET /api/v1.0/products/:prdocutId
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    if (!Object.entries(req.query).length) {
        const product = await Product.findById(req.params.productId).populate({
            path: 'vendor',
            select: 'business_name description'
        })
        if (!product) {
            return next(new ErrorResponse(`No product with the id of ${req.params.productId}`),
                404
            );
        }
        res.status(200).json({
            success: true,
            count: product.length,
            data: product
        });
    } else
        res.status(200).json(res.advancedResults)

});

// @desc    Create a new product
// @route   POST /api/v1.0/vendors/:vendorId/products
// @access  Private
exports.addProduct = asyncHandler(async (req, res, next) => {

    req.body.vendor = req.params.vendorId;
    //console.log('Creating new product from vendorId:', req.body.vendor);

    const vendor = await Vendor.findById(req.params.vendorId)
    if (!vendor) {
        return next(
            new ErrorResponse(`No vendor with the id of ${req.params.vendorId}`),
            404
        );
    }

    // Make sure vendor is product owner -- need to change structure if we want to add ownership
    // if(product.vendor.toString() !== req.vendor.id) {
    //     return next(
    //         new ErrorResponse(`Vendor ${req.vendor.id} is not authorized to add a product`)
    //     );
    // }

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        data: product
    });

});

// @desc    Update product
// @route   PUT /api/v1.0/products/:productId
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {

    console.log('Updating product:'.green, req.params.productId.toString().red);
    console.log('Products.js updateProd. req.vendor: '.green, req.vendor.toString().yellow)
    console.log('Products.js updateProd. req.body: '.green, req.body.toString().blue)


    let product = await Product.findById(req.params.productId)

    if (!product) {
        return next(
            new ErrorResponse(`No product with the id of ${req.params.productId}`),
            404
        );
    }
    product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
        new: true,
        runValidators: true
    });

    console.log('did update run', product)
    res.status(201).json({
        success: true,
        data: product
    });
});


// @desc   Delete product
// @route   DELETE /api/v1.0/vendors/:vendorId/products
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return next(new ErrorResponse(`No product with the id of ${req.params.productId}`),
            404
        );
    }

    await product.remove()

    res.status(200).json({
        success: true,
        data: {}
    });
});


// @desc    Get products within a radius
// @route   GET /api/v1.0/products/radius/:zipcode/:distance
// @access  Public
exports.getProductsInRadius = asyncHandler(async (req, res, next) => {
    /*  console.log('getProductInRadius req.params', req.params);
     console.log('getProductsInRadius res.advancedResults'.red, res.advancedResults)
     const { zipcode, distance } = req.params;
 
     // Get lat/lng from geocoder
     const loc = await geocoder.geocode(zipcode);
     const lat = loc[0].latitude;
     const lng = loc[0].longitude;
 
     // Calc radius using radians
     // Divide dist by radius of Earth = 3,663 mi / 6,378.1
     const radius = distance / 3963;
 
     const products = await Product.find({
         location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
     });
 
     res.status(200).json({
         success: true,
         count: products.length,
         data: products
     }); */

    res.status(200).json(res.advancedResults);

});