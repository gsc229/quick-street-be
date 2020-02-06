const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth'); // for auth route
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY
const path = require('path');
const geocoder = require('../utils/geocoder');

// @desc    Get all vendors
// @route   GET /api/v1.0/vendors
// @access  Public
exports.getAllVendors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get a single vendor
// @route   GET /api/v1.0/vendors/:id
// @access  Private
exports.getVendor = asyncHandler(async (req, res, next) => {

  if (!Object.entries(req.query).length) {
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      return next(
        new ErrorResponse(`Vendor not found with id of ${req.params.vendorId}`, 404)
      );
    }

    res.status(200).json({ success: true, data: vendor });
  } else res.status(200).json(res.advancedResults);


});
// @desc    Create a new vendor
// @route   POST /api/v1.0/vendors
// @access  Public
exports.createVendor = asyncHandler(async (req, res, next) => {
  const { email, password, address, business_name } = req.body;

  const vendor = await Vendor.create({
    email,
    password,
    address,
    business_name
  });
  const token = await vendor.getSignedJwtToken();
  res.status(201).send({ vendor, token });
});

// @desc    Update single vendor
// @route   PUT /api/v1.0/vendors/:id
// @access  Private
exports.updateVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, req.body, {
    new: true,
    runValidators: true
  });

  if (!vendor) {
    return next(
      new ErrorResponse(`Vendor not found with the id of ${req.params.vendorId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: vendor });
});

// @desc    Delete single vendor
// @route   DELETE /api/v1.0/vendors/:id
// @access  Private
exports.deleteVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.vendorId);
  if (!vendor) {
    return next(
      new ErrorResponse(`Vendor not found with id of ${req.params.vendorId}`, 404)
    );
  }

  vendor.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get vendors within a radius
// @route   GET /api/v1.0/vendors/radius/:zipcode/:distance?query
// @access  Public
exports.getVendorsInRadius = asyncHandler(async (req, res, next) => {



  /*  res.status(200).json({
     success: true,
     count: vendors.length,
     data: vendors
   }); */

  res.status(200).json(res.advancedResults)

});
