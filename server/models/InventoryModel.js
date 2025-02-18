'use strict';

const mongoose          = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId:{
        type:  String,
        required: true
    },
    storeId:{
        type:  String,
        required: true
    },
    quantity:{
        type:  Number,
        required: true
    },
    minStock:{
        type:  Number,
        required: true
    },    
}, {timestamps: true,versionKey: false });

module.exports = mongoose.model('inventory', inventorySchema,'inventory');