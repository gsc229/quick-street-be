const express = require('express');
const {
    getCart,
    addCart
} = require('../controllers/cart');
const Cart = require('../models/Cart')

const router = express.Router({ mergeParams: true }); //merging the URL files

router  
    .route('/')
        .get(getCart)
        .post(addCart);

module.exports = router;
