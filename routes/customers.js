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

const router = express.Router();

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