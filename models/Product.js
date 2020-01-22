const mongoose = require('mongoose');

const Product_Schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a product name']
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    diet: {
        type: [String],
        enum: ['Gluten Free', 'Vegetarian', 'Vegan', 'Keto', 'Dairy Free']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price for this product']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true
    },
    // category: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Category'
    // }
});


Product_Schema.pre('remove', async function (next) {
    console.log(`Product images being deleted from product: ${this._id}`);
    await this.model('ProductImage').deleteMany({
        product: this._id
    });
    next();
});

module.exports = mongoose.model('Product', Product_Schema);