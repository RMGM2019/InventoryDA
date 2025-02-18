'use strict';

/**
 * Module dependencies.
 */
const express           = require('express');
const router            = express.Router();
const indexRouterV1     = require('../routes');
const path              = require('path');

/**
 * Expose
 */

module.exports = (app) => {

    router.get('/',function(req,res){
        try{
            res.sendFile(path.join(__dirname+'/index.html'));
        }
        catch(e){
        }
    });
    app.use('/api', indexRouterV1);    
    app.use(router);
    
};
