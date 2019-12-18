const express = require('express');
const router = express.Router();
const {
    getAllVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor
} = require('../controllers/vendors');

router.route('/').get(getAllVendors).post(createVendor);

router.route('/:id').get(getVendor).put(updateVendor).delete(deleteVendor);


module.exports = router;
