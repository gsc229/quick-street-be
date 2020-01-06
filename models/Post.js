const mongoose = require('mongoose');

const Post_Schema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title to your post']
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true
    }
});

module.exports = mongoose.model('Post', Post_Schema);