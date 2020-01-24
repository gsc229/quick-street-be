const express = require('express');
const {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customers');
const Customer = require('../models/Customer');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const cartRouter = require('./cart');

const router = express.Router();

//Re-route into other resource route
router.use('/:customerId/cart', cartRouter);



router  
    .route('/')
        .get(advancedResults(Customer), getAllCustomers)
        .post(createCustomer)
        
router
    .route('/:customerId')
        .get(getCustomer)
        .put(updateCustomer)
        .delete(deleteCustomer)

module.exports = router;