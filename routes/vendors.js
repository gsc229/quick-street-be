const express = require('express');
const {
  getAllVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendors');

const Vendor = require('../models/Vendors');

const router = express.Router();

router
  .route('/')
  .get(getAllVendors)
  .post(createVendor);

router
  .route('/:id')
  .get(getVendor)
  .put(updateVendor)
  .delete(deleteVendor);

module.exports = router;
