const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const Vendor = require('../models/Vendor');

// vendor Auth handler
const auth = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const vendor = await Vendor.findOne({
      _id: data._id,
      'tokens.token': token
    });
    if (!vendor) {
      throw new Error();
    }
    req.vendor = vendor;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
});
module.exports = auth;
