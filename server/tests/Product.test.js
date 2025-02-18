const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const fs = require('fs');
const InventoryModel = require('../models/InventoryModel');
const ProductModel = require('../models/ProductModel');
const { GetAllProducts, GetOneProduct, UpdateOneProduct, DeleteOneProduct } = require("../controllers/ProductController");


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
//  await dropCollections();
  await dbDisconnect();
});
  

describe("GET ALL PRODUCTS", () => {
  it("Get all Products in the database no filters", async () => {
    const filters ={}

    const allProducts = await GetAllProducts(filters);
    const count = (allProducts && allProducts.length > 0)? allProducts.length: 0;
    expect(count).toBe(productsData.length);
  });


  it('Get all products where price netween 20 and 40', async ()=>{
    const filters ={
      minPrice: 20,
      maxPrice: 40
    }

    const filteredProducts = productsData.filter(p => p.price >= filters.minPrice &&  p.price<= filters.maxPrice);

    const allProducts = await GetAllProducts(filters);
    const count = (allProducts && allProducts.length > 0)? allProducts.length: 0;
    expect(count).toBe((filteredProducts && filteredProducts.length > 0 )? filteredProducts.length: 0);
  })

});


describe('GET ONE PRODUCT',  ()=>{
  it('Find Product with id  /id 1/', async ()=>{
    const productFound = await GetOneProduct('id 1');
    expect(productFound).not.toBeUndefined()
  });

  it('Not to Find Product with id  /Not an id/', async ()=>{
    const productFound = await GetOneProduct('Not an id');
    expect(productFound).toBeUndefined()
  });
});

describe('UPDATE ONE PRODUCT', () =>{
  it('Successfully update product', async()=>{
    let  newProduct =  Object.assign({}, productsData[0]);
    const newName = 'product name updated' 
    newProduct['name'] = newName;
    const productUpdated = await UpdateOneProduct(newProduct.id, newProduct);

    expect(productUpdated.name).toEqual(newName);
  });
});

describe('DELETE PRODUCT',()=>{
  it('Delete one product from the database',async() =>{
    const idForDeletion = 'id 1';
    const ProductDeleted = await DeleteOneProduct(idForDeletion);

    const productFound = await GetOneProduct(idForDeletion);

    expect(productFound).toBeUndefined();
  });
});