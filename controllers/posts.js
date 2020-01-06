const Post = require('../models/Post');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY

// @desc    Get posts
// @route   GET /api/v1.0/products
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.vendorId) {
        query = Post.find({
            vendor: req.params.vendorId
        })
        const posts = await query;

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } else {
        res.status(200).json(res.advancedResults)
    }


});