const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Cart_Schema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 0
      },

    }]

});

Cart_Schema.plugin(deepPopulate);

module.exports = mongoose.model("Cart", Cart_Schema);
