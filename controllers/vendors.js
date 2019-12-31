const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY
const path = require('path');
const geocoder = require('../utils/geocoder');


// @desc    Get all vendors
// @route   GET /api/v1.0/vendors
// @access  Public
exports.getAllVendors = asyncHandler(async (req, res, next) => {
    let query;

    // Making a copy of req.query to mutate the copy, b/c we'll still need the original req.query below
    const reqQuery = { ...req.query };
    console.log('reqQuery: ', reqQuery)
    // If there are select, sort, page or limit fields in the query, we need to remove it before we do: SomeResource.find(JSON.parse(queryStr)), so we don't get an error. At this point reqQuery could look something like: 
    /* 
        {
            vendor_category: { in: 'Spreads' },
            'location.state': 'PA',
            select: 'name,avatar'
         }

    */
    const removeFields = ['select', 'sort', 'limit', 'page'];

    // Loop over removeFields and delete them from reqQuery if it has them
    removeFields.forEach(param => delete reqQuery[param]);
    console.log('select/sort removed reqQuery: ', reqQuery);

    // After select, sort, page or limit fields have been removed, stringify reqQuery and set it to another variable so we can use the .replace string method on it.
    let queryStr = JSON.stringify(reqQuery);

    // Using string.replace() and some regEx to create Mongo "$" operators: greater than, greater than or equal to etc. in case we ever want to query things like prices with comparison operators. also making '$in' for enum fields.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding the resource. Don't forget to parse the queryStr back into a JSON object for our database. 
    query = Vendor.find(JSON.parse(queryStr));


    // Making use of our select field: (notice we are using the original req.query.select)
    if (req.query.select) {
        //Currently req.query.select looks something like this --> select: 'name,avatar'. In order to use the mongoose .select method --> query.select('name avatar') we need to get from 'name,avatar' to 'name avatar'
        let fields = req.query.select.split(',').join(' ');

        query = query.select(fields);
    }

    // Sort. Something similar as the above select if statement.
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // default sort. '-' means sort Z-A
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Executing/awaiting the query
    const vendors = await query;
    console.log(`getAllVendors queryStr`, queryStr);
    if (!vendors) {
        res.status(400).json({ success: false })
    }
    res.status(200).json({
        success: true,
        count: vendors.length,
        page: page,
        page_limit: limit,
        data: vendors
    })
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
