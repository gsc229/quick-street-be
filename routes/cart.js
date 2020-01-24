const express = require("express");
const {
  getCart,
  addCart,
  addItem,
  updateItemAfterSwitchVendor,
  deleteItem,
  deleteCart
} = require("../controllers/cart");
const Cart = require("../models/Cart");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //merging the URL files

router
  .route("/")
  .get(getCart)
  .post(addCart)
  .delete(deleteCart);
router
  .route("/addtocart")
  .post(addItem)
  .put(updateItemAfterSwitchVendor);

router.route("/deleteitem/:productId").delete(deleteItem);
module.exports = router;
