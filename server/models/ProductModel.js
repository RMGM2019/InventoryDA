'use strict';

const mongoose          = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name:  {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true,
    },
    category:  {
        type: String,
        required: true,
    },
    price:  {
        type: Number,
        required: true,
    },
    sku:  {
        type: String,
        required: true,
    }
}, {timestamps: true,versionKey: false });

module.exports = mongoose.model('product', productSchema);