const express = require("express");
const {
    getOrder,
    createOrder
} = require('../controllers/order');

const router = express.Router({ mergeParams: true }); //merging the URL files


router 
    .route('/')
        .get(getOrder)
        .post(createOrder)

// router
//     .route('/createOrder')
        

module.exports = router;