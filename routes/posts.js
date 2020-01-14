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

router.route('/').get(advancedResults(Posts, {
    path: 'vendor',
    select: 'title description date'
}), getAllPosts).post(protect, addPost);

router.route('/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost);

module.exports = router;