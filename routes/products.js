const express = require('express');
const {
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

const Products = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

// Include other resource routers
const productImagesRouter = require('./productImages');

const router = express.Router({ mergeParams: true }); //merging the URL files

// Re-route into other resource route
router.use('/:productId/product-images', productImagesRouter);

router
    .route('/')
        .get(advancedResults(Products, {
            path: 'vendor',
            select: 'business_name description'
        }), getAllProducts)
        .post(protect, addProduct); // POST /api/v1.0/vendors/:vendorId/products

router
    .route('/:id')
        .get(getProduct)
        .put(protect, updateProduct) // PUT /api/v1.0/products/:id
        .delete(protect, deleteProduct); // DELETE /api/v1.0/vendors/:vendorId/products

module.exports = router;