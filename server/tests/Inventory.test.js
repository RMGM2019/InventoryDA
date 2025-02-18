const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const fs = require('fs');
const InventoryModel = require('../models/InventoryModel');
const ProductModel = require('../models/ProductModel');
const {GetStockByStore, GetAlertsByStore, ApplyTransfer, ApplyMove} = require('../controllers/StockController')


let inventoryData = undefined;
let productsData = undefined;
inventoryData = fs.readFileSync('./db/initData/inventarioDA.inventory.json','utf8');
inventoryData = JSON.parse(inventoryData);


productsData = fs.readFileSync('./db/initData/inventarioDA.products.json','utf8');
productsData = JSON.parse(productsData);
let mongo = null;
 
const connectDB = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
 
  await mongoose.connect(uri, {dbName:'inventarioDA'
  });
};


const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};
const dropDB = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

const dropCollections = async () => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.remove();
    }
  }
};

beforeAll(async () => {
  const conn = await connectDB();
  const resInventory = await InventoryModel.insertMany(inventoryData); 
  const resProducts = await ProductModel.insertMany(productsData);  
});

afterAll(async () =>{
    // await dropCollections();
    await dbDisconnect();
});


describe('INVENTORY TESTS', () =>{
    it('Get Inventory By Store store 1', async() =>{
        const idStore = 'store 1';

        const iniventoryByStore = inventoryData.filter(i => i.storeId == idStore );

        const inventoryFound = await GetStockByStore(idStore);
        const lengthStockFound = (inventoryFound && inventoryFound.length > 0)? inventoryFound.length : 0;
        expect(lengthStockFound).toEqual(iniventoryByStore.length);
    });

    it('Get Alerts of store 1',async () =>{
        const idAlerts = 'store 1';

        const InventoryFilter = inventoryData.filter(i => i.storeId == idAlerts && i.quantity <= i.minStock);

        const inventoryFound = await GetAlertsByStore(idAlerts);
        expect(inventoryFound.length).toBe(InventoryFilter.length);
    });

    it('Apply Transfer', async() =>{
      const transferBody = {
        productId: "id 1",
        sourceStoreId: "store 1",
        targetStoreId: "store 2",
        quantity: 2,
        type: "TRANSFER"
      }

      const sourceInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.sourceStoreId , quantity: {$gte:transferBody.quantity}});
      const targetInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.targetStoreId});

      const transferApply = await ApplyTransfer(transferBody);

      const afterSourceInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.sourceStoreId });
      const afterTargetInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.targetStoreId});

      expect(afterSourceInventory.quantity).toBe(sourceInventory.quantity - transferBody.quantity);
      expect(afterTargetInventory.quantity).toBe(targetInventory.quantity + transferBody.quantity);     
    });


    it('Add Product', async() =>{
      const transferBody = {
        productId: "id 1",
        sourceStoreId: "store 1",
        targetStoreId: "store 2",
        quantity: 2,
        type: "IN"
      }

      const sourceInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.sourceStoreId});  

      const applyMove = await ApplyMove(transferBody);

      expect(applyMove.quantity).toBe(sourceInventory.quantity + transferBody.quantity);
    });


    
    it('Sustract Product', async() =>{
      const transferBody = {
        productId: "id 1",
        sourceStoreId: "store 1",
        targetStoreId: "store 2",
        quantity: 2,
        type: "OUT"
      }

      const sourceInventory = await InventoryModel.findOne({productId: transferBody.productId, storeId:transferBody.sourceStoreId});  

      const applyMove = await ApplyMove(transferBody);

      expect(applyMove.quantity).toBe(sourceInventory.quantity - transferBody.quantity);
    });

});