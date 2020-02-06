const express = require('express');
const {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getHistory
} = require('../controllers/customers');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const cartRouter = require('./cart');
const orderRouter = require('./order')

const router = express.Router();

//Re-route into other resource route
router.use('/:customerId/cart', cartRouter);
router.use('/:customerId/order', orderRouter);


router
    .route('/')
    .get(advancedResults(Customer), getAllCustomers)
    .post(createCustomer)

router
    .route('/:customerId')
    .get(getCustomer)
    .put(protect, updateCustomer)
    .delete(protect, deleteCustomer)

router
    .route("/getHistory")
    .get(getHistory);

module.exports = router;