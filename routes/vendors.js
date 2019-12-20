const express = require('express');
const {
    getAllVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    avatarPhotoUpload,
    getVendorsInRadius
} = require('../controllers/vendors');


// Include other resource routers 
const productRouter = require('./products');


const router = express.Router();

// Re-route into other resource route
router.use('/:vendorId/products', productRouter);

router.route('/radius/:zipcode/:distance').get(getVendorsInRadius);

router.route('/').get(getAllVendors).post(createVendor);

router.route('/:id').get(getVendor).put(updateVendor).delete(deleteVendor);

router.route('/:id/avatar').put(avatarPhotoUpload);

module.exports = router;
