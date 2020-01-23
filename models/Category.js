const mongoose = require('mongoose');


const Category_Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true
    }
})

module.exports = mongoose.model('Category', Category_Schema);