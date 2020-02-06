const express = require('express');
const {
  getAllVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorsInRadius
} = require('../controllers/vendors');

const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const productRouter = require('./products');
const postRouter = require('./posts');
const productImageRouter = require('./productImages');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.use(protect);

// Re-route into other resource route
router.use('/:vendorId/products', advancedResults(Product), productRouter);
router.use('/:vendorId/posts', postRouter);
router.use('/:vendorId/product-images', productImageRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(advancedResults(Vendor), getVendorsInRadius);

router
  .route('/')
  .get(advancedResults(Vendor), getAllVendors)
  .post(protect, createVendor); // POST /api/v1.0/vendors

router
  .route('/:vendorId')
  .get(advancedResults(Vendor), getVendor)
  .put(protect, updateVendor) // PUT /api/v1.0/vendors/:id
  .delete(protect, deleteVendor); // DELETE /api/v1.0/vendors/:id

module.exports = router;
