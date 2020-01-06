const express = require('express');
const {
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

const Products = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true }); //merging the URL files

router.route('/').get(advancedResults(Products, {
    path: 'vendor',
    select: 'business_name description'
}), getAllProducts).post(addProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;