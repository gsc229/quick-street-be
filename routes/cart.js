const express = require('express');
const {
    getCart,
    addCart,
    addItem,
    deleteCart
} = require('../controllers/cart');
const Cart = require('../models/Cart');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true }); //merging the URL files

router  
    .route('/')
        .get(getCart)
        .post(addCart)
        .delete(deleteCart);
router
    .route('/addtocart')
        .post(addItem)
module.exports = router;
