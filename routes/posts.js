const express = require('express');
const {
    getAllPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
} = require('../controllers/posts');

const Posts = require('../models/Post');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });

router
    .route('/')
        .get(advancedResults(Posts, {
            path: 'vendor',
            select: 'title description date'
        }), getAllPosts)
        .post(protect, addPost); // POST /api/v1.0/vendors/:vendorId/posts

router
    .route('/:id')
        .get(getPost)
        .put(protect, updatePost) // PUT /api/v1.0/post/:id
        .delete(protect, deletePost); // DELETE /api/v1.0/vendors/:vendorId/posts

module.exports = router;