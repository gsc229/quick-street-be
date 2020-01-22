const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const Vendor = require('../models/Vendor');
const Customer = require('../models/Customer');

/// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    // Set token from Bearer token in header
    token = req.headers.authorization;
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }


/// *******  Uncomment out if we decide to use Bearer Authorization ********


  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
    // Set token from Bearer token in header
    // token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  // }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

/// *******  Uncomment out if we decide to use Bearer Authorization ********

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('decoded token', decoded);

    req.vendor = await Vendor.findById(decoded.id);
    req.customer = await Customer.findById(decoded.id);

    if(req.params.vendorId === req.vendor.id || req.params.customerId === req.customer.id) {
      next();
    } else {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
