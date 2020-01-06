const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY
const path = require('path');
const geocoder = require('../utils/geocoder');


// @desc    Get all vendors
// @route   GET /api/v1.0/vendors
// @access  Public
exports.getAllVendors = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

});

// @desc    Get a single vendor
// @route   GET /api/v1.0/vendors/:id
// @access  Private
exports.getVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id).populate({
        path: 'products',
        select: 'name price product_images'
    });

    if (!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: vendor });
});
// @desc    Create a new vendor
// @route   POST /api/v1.0/vendors
// @access  Public
exports.createVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.create(req.body);

    res.status(201).json({ success: true, data: vendor });
});

// @desc    Update single vendor
// @route   PUT /api/v1.0/vendors/:id
// @access  Private
exports.updateVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with the id of ${req.params.id}`, 404)
        );
    }


    res.status(200).json({ success: true, data: vendor });
});

// @desc    Delete single vendor
// @route   DELETE /api/v1.0/vendors/:id
// @access  Private
exports.deleteVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    }

    vendor.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get vendors within a radius
// @route   GET /api/v1.0/vendors/raduis/:zipcode/:distance
// @access  Private
exports.getVendorsInRadius = asyncHandler(async (req, res, next) => {
    console.log('req params', req.params);
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth = 3,663 mi / 6,378.1
    const radius = distance / 3963;

    const vendors = await Vendor.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors
    });
});
