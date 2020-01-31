const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get product images
// @route   GET /api/v1.0/products/product-images/:productId
// @route   GET /api/v1.0/vendors/:vendorId/product-images
// @access  Public
exports.getAllImages = asyncHandler(async (req, res, next) => {

  //if there's no query object i.e. /:vendorId/product-images?selecet=public_id ...
  if (!Object.entries(req.query).length) {
    console.log('productImages.js req.params'.red, req.params)
    let query;
    // check to see which parmas, productId or vendorId
    if (req.params.productId) {
      query = ProductImage.find({
        product: req.params.productId
      })
      const productImages = await query;
      res.status(200).json({
        success: true,
        count: productImages.length,
        data: productImages
      });

    }
    if (req.params.vendorId) {
      console.log('productImages.js if(req.params.vendorId): '.red, req.params.vendorId)
      query = ProductImage.find({
        vendor: req.params.vendorId
      })
      const productImages = await query;
      console.log(productImages)
      res.status(200).json({
        success: true,
        count: productImages.length,
        data: productImages
      })
    }

  }
  // if there is a query object return the response from the advanced results middlware.
  else {
    res.status(200).json(res.advancedResults)
  }

})

// @desc    Create a product-image object
// @route   POST /api/v1.0/products/:productId/product-images
// @access  Private
exports.addImage = asyncHandler(async (req, res, next) => {
  // create and set a product property on the image object equal to the parameters
  req.body.product = req.params.productId;

  if (req.body.vendorId !== req.body.vendor) {
    return next(
      new ErrorResponse(`Auth middlware requires a vendorId field in the image object. The ProductImage schema requires a vendor property (the same id) in the body of the image object. --> req.body.vendorId ${req.body.vendorId} !== ${req.body.vendor} req.body.vendor`),
      401
    );
  }

  console.log('Creating new productImage from productId:', req.body.product);
  const product = await Product.findById(req.params.productId)
  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.productId}`),
      404
    );
  }

  const image = await ProductImage.create(req.body);

  product.product_image = image;
  product.save();

  res.status(200).json({
    success: true,
    data: image
  })



});

// @desc    Delete post
// @route   DELETE /api/v1.0/product-images/:imageId
// @access  Private
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const image = await ProductImage.findById(req.params.imageId);

  if (!image) {
    return next(new ErrorResponse(`No image with the id of ${req.params.imageId}`),
      404
    );
  }

  await image.remove()

  res.status(200).json({
    success: true,
    data: {}
  });
});
