const express = require('express');
const {
    getAllProducts
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true }); //merging the URL files

router.route('/').get(getAllProducts);

module.exports = router;