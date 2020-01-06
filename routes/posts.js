const express = require('express');

const {
    getAllPosts,
    getPost
} = require('../controllers/posts');

const Posts = require('../models/Post');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/').get(advancedResults(Posts, {
    path: 'vendor',
    select: 'title description date'
}), getAllPosts);

router.route('/:id').get(getPost);

module.exports = router;