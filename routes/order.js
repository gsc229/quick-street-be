const express = require("express");
const {
    getAllOrders,
    getSingleOrder,
    createOrder
} = require('../controllers/order');

const router = express.Router({ mergeParams: true }); //merging the URL files


router 
    .route('/')
        .get(getAllOrders)
        .post(createOrder)

router
    .route('/:orderId')
        .get(getSingleOrder)

module.exports = router;