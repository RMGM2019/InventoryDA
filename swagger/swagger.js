const  swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory API test',
            version: '1.0.0',
            description: 'API for managing Inventory',
            contact: {
                name: 'Raul Valdez'
            },
            servers: [
                {
                    url: 'http://localhost:80',
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./server/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports= specs;