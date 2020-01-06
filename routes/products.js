const express = require('express');
const {
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true }); //merging the URL files

router
    .route('/')
    .get(getAllProducts)
    .post(addProduct);

router.route('/:id')
    .get(getProduct)
    .put(updateProduct);

module.exports = router;