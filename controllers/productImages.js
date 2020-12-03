const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary').v2

// @desc    Get product images
// @route   GET /api/v1.0/products/product-images/:productId
// @route   GET /api/v1.0/vendors/:vendorId/product-images
// @route   GET /api/v1.0/product-images
// @access  Public
exports.getAllImages = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults)

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
  console.log("DELTE controllers/productImages",{"req.params": req.params})
  const image = await ProductImage.findById(req.params.imageId);
  const vendorId = req.vendor._id;
  

  if (!image) {
    console.log("Error image not found")
    return next(new ErrorResponse(`No image with the id of ${req.params.imageId}`),
      404
    );
  }
  
  if(image.vendor.toString() !== vendorId.toString()){
    console.log(vendorId, image.vendor)
    return next(new ErrorResponse(`You are not the owner of the image with id of: ${req.params.imageId}`),
      403
    );
  }

  const public_id = image.public_id;
  let deleteResult;
  let deleteError;
  

  /* await cloudinary.uploader.destroy(public_id, function(error, result){
    deleteResult = result
    deleteError = error
    
    console.log('cloudinary image destroy info: ')
    console.log(result, error)

  }) */


  await image.remove()
  console.log(image)

  /* if(deleteResult.result === 'not found'){
    return next(new ErrorResponse(`Image info deleted from Market Ave. database, but returned with a result of 'not found' from the Cloudinary api.
    This probably means that the image was deleted from Cloudinary before the image information object was deleted from the Market Ave. database.`), 200)
  }
 */
  

  res.status(200).json({
    success: true,
    data: `public_id: ${public_id} destoryed`,
    result: deleteResult ? deleteResult : `No result info`,
    
  });
});



