'use strict';

const mongoose          = require('mongoose');

const moveSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true,
    },
    sourceStoreId:{
        type: String,
    },
    targetStoreId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date
    },
    type: {
        type: String,
        required: true,
        enum : ['IN','OUT','TRANSFER'],
    }
}, {timestamps: true,versionKey: false });

module.exports = mongoose.model('move', moveSchema);
