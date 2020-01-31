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
        enum: [
            'Gluten Free',
            'Vegetarian',
            'Vegan',
            'Keto',
            'Dairy Free']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price for this product']
    },
    unit: {
        type: String,
        default: ""
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
    quantity: {
        type: Number
    },
    location: Object,
    product_image: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductImage'
    }

},
    { //why are these here? See Note on Reverse Populate over function below.
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);


Product_Schema.pre('remove', async function (next) {
    console.log(`Product images being deleted from product: ${this._id}`);
    await this.model('ProductImage').deleteMany({
        product: this._id
    });
    next();
});


// Note on Reverse Populate:  with virtual. For every Product, this function will attach an array of objects of the Product's images. To activate this virtual, either 1. do Vendor.find('some query').poplulate('products') at the controller level, or 2. do advancedFilter('Vendors', {path: products}) at the route level or 3. attach a query paramer called populate in the req.query ex. /products?populate=images . With queries, you can even next. ex. /vendors?populate=products&nest=images
Product_Schema.virtual('images', {
    ref: 'ProductImage',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})



module.exports = mongoose.model('Product', Product_Schema);