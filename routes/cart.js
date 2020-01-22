const express = require('express');
const {
    getCart,
    addCart,
    deleteCart
} = require('../controllers/cart');
const Cart = require('../models/Cart')

const router = express.Router({ mergeParams: true }); //merging the URL files

router  
    .route('/')
        .get(getCart)
        .post(addCart)
        .delete(deleteCart);

module.exports = router;
