'use strict';

const express                               = require('express');
const router                                = express.Router();

const {
    AddProductEndpoint,
    GetAllProductsEndpoint,
    GetOneProductEndpoint,
    UpdateOneProductEndpoint,
    DeleteOneProductEndpoint
} = require('../controllers/ProductController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - category
 *         - price          
 *         - sku
 *       properties:
 *         id:
 *           type: string
 *           description: manually generated id for the product
 *         name:
 *           type: string
 *           description: name of the product
 *         description:
 *           type: string
 *           description: description of the product
 *         category:
 *           type: string
 *           description: category od the product
 *         price:
 *           type: number
 *           description: price of the product
 *         sku:
 *           type: string
 *           description: sku id of the product
 *       example:
 *          id: id 5,
 *          name: name 4,
 *          description: description 4,
 *          category: cat 1,
 *          price: 40.1,
 *          sku: sku 4
 */

/**
 * @swagger
 * tags:
 *   name: Product Routes
 *   description: Product routes
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: POST new product 
 *     tags: [Product Routes]
 *     responses:
 *       200:
 *         description: Return the new document of the product
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
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
router.post('/products', AddProductEndpoint);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: get list of product 
 *     tags: [Product Routes]
 *     responses:
 *       200:
 *         description: Return the list of all products in teh database 
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:                  
 *                      $ref: '#/components/schemas/Product'
 *       400:
 *          description: return error if an error occurred in the endpoint
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
router.get('/products',GetAllProductsEndpoint);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: get one product by id
 *     tags: [Product Routes]
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Id of the product
 *     responses:
 *       200:
 *         description: Return one product of the databse
 *         content:
 *           application/json:
 *              schema:                 
 *                  $ref: '#/components/schemas/Product'
 *       400:
 *          description: return error if an error occurred in the endpoint
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
router.get('/products/:id',GetOneProductEndpoint);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: get one product by id
 *     tags: [Product Routes]
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Id of the product
 *     responses:
 *       200:
 *         description: Update on product in the database
 *         content:
 *           application/json:
 *              schema:                 
 *                  $ref: '#/components/schemas/Product'
 *       400:
 *          description: return error if an error occurred in the endpoint
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
router.put('/products/:id',UpdateOneProductEndpoint);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: get one product by id
 *     tags: [Product Routes]
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Id of the product
 *     responses:
 *       200:
 *         description: Delete the product in the database with the id send in the path
 *         content:
 *           application/json:
 *              schema:                 
 *                  $ref: '#/components/schemas/Product'
 *       400:
 *          description: return error if an error occurred in the endpoint
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
router.delete('/products/:id',DeleteOneProductEndpoint);

module.exports = router;