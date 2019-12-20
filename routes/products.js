const express = require('express');
const {
    getAllProducts
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router();

router.route('/').get(getAllProducts);

module.exports = router;