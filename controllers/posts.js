const Post = require('../models/Post');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY

// @desc    Get posts
// @route   GET /api/v1.0/posts
// @route   GET /api/v1.0/vendors/:vendorId/posts
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
        res.status(201).json(res.advancedResults)
    }

});

// @desc    Get a single post
// @route   GET /api/v1.0/post/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'vendor',
        select: 'title description date'
    });

    if (!post) {
        return next(new ErrorResponse(`No post with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        count: post.length,
        data: post
    });
});

// @desc    Create a new post
// @route   POST /api/v1.0/vendors/:vendorId/posts
// @access  Private
exports.addPost = asyncHandler(async (req, res, next) => {

    req.body.vendor = req.params.vendorId;
    console.log('Creating new post from vendorId:', req.body.vendor);
    const vendor = await Vendor.findById(req.params.vendorId)
    if (!vendor) {
        return next(
            new ErrorResponse(`No vendor with the id of ${req.params.vendorId}`),
            404
        );
    }

    const post = await Post.create(req.body);
    res.status(200).json({
        success: true,
        data: post
    })

});

// @desc    Update post
// @route   PUT /api/v1.0/post/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    console.log('Updating post:', req.params.id);
    let post = await Post.findById(req.params.id)

    if (!post) {
        return next(
            new ErrorResponse(`No vendor with the id of ${req.params.id}`),
            404
        );
    }
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: post
    });
});

// @desc    Delete post
// @route   DELETE /api/v1.0/vendors/:vendorId/posts
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`No post with the id of ${req.params.id}`),
            404
        );
    }

    await post.remove()

    res.status(200).json({
        success: true,
        data: {}
    });
});