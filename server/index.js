
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const specs = require('../swagger/swagger.js');

const InventoryModel = require('./models/InventoryModel');
const ProductModel = require('./models/ProductModel');

app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

require('./middleware/express-router')(app);

const connectToMongo = async() =>{
    await mongoose.connect(
        //`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/inventarioDA?authSource=admin`,
         //`mongodb://host.docker.internal:27017/inventarioDA`,
        // `mongodb://mongodb:27017/inventarioDA`,
        `mongodb://localhost:27017/inventarioDA`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => 
        {
            console.log('CONNECTED TO MONGODB');
            listen();
            InsertInitialData();
        }
      )
      .catch( (err) =>{
          console.error('FAILED TO CONNECT TO MONGODB');
          console.error(err);
      }
      );
}
const listen = () =>{
    app.listen(80, () =>{
        console.log('App listening on port 80');
    });
}

const InsertInitialData = async () =>{
  let inventoryData = fs.readFileSync('./db/initData/inventarioDA.inventory.json','utf8');
  inventoryData = JSON.parse(inventoryData);

  
  let productsData = fs.readFileSync('./db/initData/inventarioDA.products.json','utf8');
  productsData = JSON.parse(productsData);
  
  const inventoryDocuments = await InventoryModel.find();
  const productDocuments = await ProductModel.find();
  if(!inventoryDocuments || inventoryDocuments.length ==0){
    const resInventory = await InventoryModel.insertMany(inventoryData);

    console.log('Inserting Inventory Data');
  }

  if(!productDocuments || productDocuments.length== 0){    
    const resProducts = await ProductModel.insertMany(productsData);  

    console.log('Inserting Products Data');
  }
  
};

connectToMongo();