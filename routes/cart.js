const express = require("express");
const {    
    getAllCarts,
    getCart,
    addCart,
    addItem,
    updateItemAfterSwitchVendor,
    deleteItem,
    deleteCart,
    addPayment
} = require("../controllers/cart");
const Cart = require("../models/Cart");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //merging the URL files

router
  .route("/") // /api/v1.0/customers/:customerId/cart
    .get(getCart)
    .post(addCart);

router
  .route("/addtocart")
    .post(addItem)
    .put(updateItemAfterSwitchVendor);

router
    .route("/deleteitem/:productId")
        .delete(deleteItem);

router
    .route("/:cartId")
        .delete(deleteCart);

router
    .route("/payment")
        .post(addPayment);


module.exports = router;
