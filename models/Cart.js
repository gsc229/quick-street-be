const mongoose = require('mongoose');


const Cart_Schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    items: [{
        item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        }
    }]
})

module.exports = mongoose.model('Cart', Cart_Schema);