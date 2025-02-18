'use strict';

const express  = require("express");
const ProductRoutes = require('./ProductRoutes');
const StockRoutes = require('./StockRoutes');

const router = express.Router();

router.use('/', ProductRoutes);
router.use('/', StockRoutes);

module.exports = router;