const Vendor = require('../models/Vendors');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async');

exports.getAllVendors = asyncHandler(async (req, res, next) => {
    try {
        const vendors = await Vendor.find();

        res.status(200).json({ success: true, data: vendors })
    } catch {
        res.status(400).json({ success: false })
    }
});

exports.getVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id);

    if(!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    } 
    res.status(200).json({ success: true, data: vendor });
});

exports.createVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.create(req.body);

    res.status(201).json({ success: true, data: vendor });
});

exports.updateVendor = asyncHandler(async (req, res, next) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!vendor) {
            return next(
                new ErrorResponse(`Vendor not found with the id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({ success: true, data: vendor });
    } catch (err) {
        next(err);
    }
});

exports.deleteVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id)
    if(!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        );
    }

    vendor.remove();

    res.status(200).json({ success: true, data: {} });
});