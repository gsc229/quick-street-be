const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [
        {
            productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ]
});

module.exports = mongoose.model('Order', OrderSchema);