const express = require("express");
const {
<<<<<<< HEAD
  getCart,
  addCart,
  addItem,
  updateCart,
  deleteCart
} = require("../controllers/cart");
const Cart = require("../models/Cart");
=======
    getCart,
    addCart,
    addItem,
    updateItem,
    deleteItem,
    deleteCart
} = require('../controllers/cart');
const Cart = require('../models/Cart');
>>>>>>> cadfa4769db3a93638ace468a77dc2825545f370

const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //merging the URL files

router
<<<<<<< HEAD
  .route("/")
  .get(getCart)
  .post(addCart)
  .delete(deleteCart);
router
  .route("/addtocart")
  .post(addItem)
  .put(updateCart);
=======
    .route('/addtocart')
        .post(addItem)
        .put(updateItem)
        
router
    .route('/deleteitem/:productId')
        .delete(deleteItem)
>>>>>>> cadfa4769db3a93638ace468a77dc2825545f370
module.exports = router;
