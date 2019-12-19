const Vendors = require('../models/Vendors');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getAllVendors = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all vendors'});
});

exports.getVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendors.findById(req.params.id)

    if(!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    } 
    res.status(200).json({ success: true, data: vendor});
});

exports.createVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendors.create(req.body)

    res.status(201).json({ success: true, data: vendor });
});

exports.updateVendor = asyncHandler(async (req, res, next) => {
    let vendor = await Vendors.findById(req.params.id);

    if(!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: vendor });
});

exports.deleteVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendors.findById(req.params.id)
    if(!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    }

    vendor.remove();

    res.status(200).json({ success: true, data: {} });
});