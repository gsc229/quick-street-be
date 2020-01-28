const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const Vendor = require('../models/Vendor');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

/// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    // Set token from Bearer token in header
    token = req.headers.authorization;
    console.log('auth.js MW if(req.headers.authorization) token: '.blue, token);
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
    return next(new ErrorResponse('Not authorized to access this route line 41 no token', 401));
  }

  /* try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('decoded token', decoded);

    req.vendor = await Vendor.findById(decoded.id);
    req.customer = await Customer.findById(decoded.id);

    if (req.params.productId) {
      req.product = await Product.findById(req.params.productId) //this checks the DB
      console.log('decodedvendor id ', req.vendor.id)
      console.log('vendor object', req.product.vendor.toString())

      if (req.product.vendor.toString() === req.vendor.id) {
        console.log('is true')
        next()

      } else {
        return next(new ErrorResponse('Not authorized to edit this product', 401));
      }
    }

    else if (req.params.vendorId === req.vendor.id || req.params.customerId === req.customer.id) {
      next();
    } else {
      return next(new ErrorResponse('Not authorized to access this route with vendor and customer check', 401));
    }

  } catch (err) {
    console.log('error caught', err)
    return next(new ErrorResponse('Not authorized to access this route', 401));
  } */

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const vendor = await Vendor.findById(decoded.id);
  const vendorParamId = req.params.vendorId;
  const vendorBodyId = req.body.vendorId;

  console.log(vendorBodyId);
  const customer = await Customer.findById(decoded.id);
  const customerParamId = req.params.customerId;
  const customerBodyId = req.body.customerId;




  if (vendor) {
    console.log('auth.js 92 Vendor: '.green, vendor.toString().blue)
    if (vendor._id.toString() === vendorParamId || vendor._id.toString() === vendorBodyId) {

      req.vendor = vendor;
      next();
    } else return next(new ErrorResponse(`Not authorized to access this route. The ID supplied doesn't match the token ID for this vendor`, 401));

  }

  if (customer) {
    console.log("Customer: ".blue, customer);
    if (customer._id.toString() === customerParamId || customer._id.toString() === customerBodyId) {
      req.customer = customer;
      next();
    } else return next(new ErrorResponse(`Not authorized to access this route. The ID supplied doesn't match the token ID for this customer`, 401));
  }



  /*  if (vendor._id.toString() === vendorBodyId) {
 
     console.log('HIT IF STATEMENT vendorBodyId');
     req.vendor = vendor
     next();
   }
  */


});

// Grant access to specific roles
