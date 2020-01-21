const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all customers
// @route   GET /api/v1.0/customers
// @access  Public
