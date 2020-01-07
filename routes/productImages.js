const express = require('express');

const {
  getAllImages,
  addImage,
  deleteImage
} = require('../controllers/productImages');

const ProductImages = require('../models/ProductImage');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(ProductImages), getAllImages).post(addImage);
router.route('/:imageId').delete(deleteImage);
module.exports = router;