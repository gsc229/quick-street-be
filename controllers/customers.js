const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all customers
// @route   GET /api/v1.0/customers
// @access  Public
exports.getAllCustomers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})


// @desc    Get customer by ID
// @route   GET /api/v1.0/customers/:customerId
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
    console.log(`GET getCustomer`)
    const customer = await Customer.findById(req.params.customerId);

    if (!customer) {
        return next(
            new ErrorResponse(`Customer with the id ${req.params.customerId} is not found`, 404)
        )
    }
    res.status(200).json({ success: true, data: customer })
});

// @desc    Create customer
// @route   POST /api/v1.0/customers
// @access  Public
exports.createCustomer = asyncHandler(async (req, res, next) => {
    const { email, password, first_name, last_name } = req.body;

    const customer = await Customer.create({
        email,
        password,
        first_name,
        last_name
    })

    res.status(201).json({ customer })
});


// @desc    Update customer by ID
// @route   PUT /api/v1.0/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findByIdAndUpdate(req.params.customerId, req.customer, {
        new: true,
        runValidators: true
    });

    if (!customer) {
        return next(
            new ErrorResponse(`Customer with the id ${req.params.customerId} is not found`, 404)
        )
    }
    res.status(200).json({ success: true, data: customer })
});


// @desc    Delete customer by ID
// @route   Delete /api/v1.0/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findByIdAndDelete(req.params.customerId);

    if (!customer) {
        return next(
            new ErrorResponse(`Customer with the id ${req.params.customerId} is not found`, 404)
        )
    }

    customer.remove();

    res.status(200).json({ success: true, data: {} })
});

exports.getHistory = asyncHandler(async (req, res, next) => {
    const customer = (await Customer.findOne({ _id: req.params.customerId })).populate('history.item history.paid').exec(function(err, foundCustomer) {
        if(err) return next(err);

        res.send({ data: foundCustomer})
    })

    if(!customer) {
        return next(new ErrorResponse(`Customer with the id ${req.params.customerId} is not found`, 404))
    }
})