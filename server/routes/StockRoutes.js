'use strict';

const express                               = require('express');
const router                                = express.Router();

const {
    GetInventoryByStoreEndpoint,
    TrasnferInventoryEndpoint,
    GetInventoryAlertsEndpoint
} = require('../controllers/StockController')



/**
 * @swagger
 * components:
 *   schemas:
 *     Move:
 *       type: object
 *       required:
 *         - productId
 *         - sourceStoreId
 *         - targetStoreId
 *         - category
 *       properties:
 *         productId:
 *           type: string
 *           description: manually generated id for the product
 *         sourceStoreId:
 *           type: string
 *           description: id of the source store
 *         targetStoreId:
 *           type: string
 *           description: id of the target store
 *         quantity:
 *           type: string
 *           description: quantity of products
 *         timestamp:
 *           type: number
 *           description: time stamp
 *         type:
 *           type: string
 *           description: emun of types (IN , OUT, TRANSFER)
 *       example:
 *          productId: id 1,
 *          sourceStoreId: store 2,
 *          targetStoreId: store 1,
 *          quantity: 2,
 *          type: TRANSFER
 */

/**
 * @swagger
 * tags:
 *   name: Stock Routes
 *   description: Stock routes
 */

/**
 * @swagger
 * /api/stores/{id}/inventory:
 *   get:
 *     summary: get the list of inventory one store
 *     tags: [Stock Routes]
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Id of the store
 *     responses:
 *       200:
 *         description: Return the inventory of the store with the id in path
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Move'
 *       400:
 *          description: return erro if an error occurred in the endpoint
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      ok:
 *                          type: boolean
 *                      msg: 
 *                          type: string
 */
router.get('/stores/:id/Inventory', GetInventoryByStoreEndpoint);

/**
 * @swagger
 * /api/inventory/alerts:
 *   get:
 *     summary: get the list of inventory one store
 *     tags: [Stock Routes]
 *     responses:
 *       200:
 *         description: Return the list of products with low quantity by store
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Move'
 *       400:
 *          description: return erro if an error occurred in the endpoint
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      ok:
 *                          type: boolean
 *                      msg: 
 *                          type: string
 */
router.get('/inventory/Alerts', GetInventoryAlertsEndpoint);

/**
 * @swagger
 * /api/inventory/transfer:
 *   post:
 *     summary: make the trasnfer of the product from the source store to que target store
 *     tags: [Stock Routes]
 *     responses:
 *       200:
 *         description: Return the new documents of the in the database after the trasnfer of the product
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Move'
 *       400:
 *          description: return erro if an error occurred in the endpoint
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      ok:
 *                          type: boolean
 *                      msg: 
 *                          type: string
 */
router.post('/inventory/Trasnfer', TrasnferInventoryEndpoint);

module.exports = router;