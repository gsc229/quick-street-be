const express = require('express');

const {
  getAllImages,
  addImage,
  deleteImage
} = require('../controllers/productImages');

const ProductImages = require('../models/ProductImage');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router
  .route('/')
    .get(advancedResults(ProductImages), getAllImages)
    .post(protect, addImage); // POST /api/v1.0/products/:productId/product-images

router
  .route('/:imageId')
    .delete(protect, deleteImage); // DELETE /api/v1.0/product-images/:imageId

module.exports = router;