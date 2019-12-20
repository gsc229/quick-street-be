const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY
const path = require('path');
const geocoder = require('../utils/geocoder');

exports.getAllVendors = asyncHandler(async (req, res, next) => {
        const vendors = await Vendor.find();

        res.status(200).json({ 
            success: true, 
            count: vendors.length, 
            data: vendors })

        res.status(400).json({ success: false })

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

// @desc    Update single vendor
// @route   PUT /api/v1.0/vendors/:id
// @access  Private
exports.updateVendor = asyncHandler(async (req, res, next) => {
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
});

// @desc    Delete single vendor
// @route   DELETE /api/v1.0/vendors/:id
// @access  Private
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


exports.avatarPhotoUpload = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id);
    console.log(req.files);
    if (!vendor) {
        return next(
            new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
        )
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.file;

    //Check to make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        );
    }
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // Create a custom filename base off of vendor id
    file.name = `photo_${vendor._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.AVATAR_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }


        await Vendor.findByIdAndUpdate(req.params.id, { avatar: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });

    })

}) 
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
        location: { $geoWithin: { $centerSphere: [[ lng, lat ], radius] } }
    });

    res.status(200).json({ 
        success: true, 
        count: vendors.length, 
        data: vendors 
    });
});
