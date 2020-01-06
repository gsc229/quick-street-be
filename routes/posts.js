const express = require('express');
const {
    getAllPosts,
    getPost,
    addPost,
    updatePost
} = require('../controllers/posts');

const Posts = require('../models/Post');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Posts, {
    path: 'vendor',
    select: 'title description date'
}), getAllPosts).post(addPost);

router.route('/:id').get(getPost).put(updatePost);

module.exports = router;