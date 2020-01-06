const express = require('express');
const {
    getAllVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    getVendorsInRadius
} = require('../controllers/vendors');

const Vendors = require('../models/Vendor');

const advancedResults = require('../middleware/advancedResults');


// Include other resource routers 
const productRouter = require('./products');
const postRouter = require('./posts')

const router = express.Router();

// Re-route into other resource route
router.use('/:vendorId/products', productRouter);
router.use('/:vendorId/posts', postRouter);

router.route('/radius/:zipcode/:distance').get(getVendorsInRadius);

router.route('/').get(advancedResults(Vendors), getAllVendors).post(createVendor);

router.route('/:id').get(getVendor).put(updateVendor).delete(deleteVendor);

module.exports = router;
