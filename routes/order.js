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

        

module.exports = router;