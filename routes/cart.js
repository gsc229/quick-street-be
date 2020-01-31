const express = require("express");
const {    
    getCart,
    addCart,
    addItem,
    updateQuantity,
    deleteItem,
    deleteCart,
    addPayment
} = require("../controllers/cart");
const Cart = require("../models/Cart");

// need to import protect middleware


const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //merging the URL files

router
  .route("/") // /api/v1.0/customers/:customerId/cart
    .get(getCart)
    .post(addCart);

router
  .route("/addtocart")
    .post(addItem)
    .put(updateQuantity);

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
