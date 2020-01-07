const express = require('express');

const {
  getAllImages,
} = require('../controllers/productImages');

const ProductImages = require('../models/ProductImage');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(ProductImages), getAllImages);

module.exports = router;