const InventoryModel = require("../models/InventoryModel");
const ProductModel = require("../models/ProductModel");

//#region Endpoints
const AddProductEndpoint = async (req,res) =>{
    const productValidated = ValidateProduct(req.body);

    if(!productValidated) return res.status(400).send('Invalid product');

    const productFound = await ProductModel.findOne({id: req.body.id});
    if(productFound) return res.status(400).send({ok: false, msg: `product found using the same id ${req.body.id}`});

    const newProduct = await new ProductModel(productValidated).save();

    return res.status(201).send({ok: true, msg:'product created successfully', data: newProduct})
};

const GetAllProductsEndpoint = async (req,res) =>{
    const categoryHeader = req.headers['category'];
    const minPriceHeader = req.headers['minprice'];
    const maxPriceHeader = req.headers['maxprice'];
    const inStockHeader = req.headers['instock'];

    const filters ={
        category : categoryHeader,
        minPrice: !isNaN(minPriceHeader)? parseFloat(minPriceHeader): undefined ,
        maxPrice: !isNaN(maxPriceHeader)? parseFloat(maxPriceHeader): undefined ,
        inStock: inStockHeader
    }

    const allProducts = await GetAllProducts(filters);

    if(!allProducts || allProducts.length == 0 ) return res.status(404).send({ok: false, msg:`no products found`})

    return res.status(200).send({ok: true, msg:`products currently on the database ${allProducts.length}`, data: allProducts});

};

const GetOneProductEndpoint = async (req,res) =>{
    const idParam = req.params['id'];
    const product = await GetOneProduct(idParam)
     if(!product) return res.status(404).send({ok: false, msg:'No product found'});

    return res.status(200).send({ok: true, msg:'product found', data: product});
};

const UpdateOneProductEndpoint = async (req,res) =>{
    const productIdParam = req.params['id']
    const productBody = req.body;

    if(!productIdParam ) return res.status(404).send({ok: false, msg:'id is mandatory to update one product'});
    if(!productBody)return res.status(404).send({ok: false, msg:'body is mandatory to update one product'});

    const productUpdated = await UpdateOneProduct(productIdParam, productBody);

    if(!productUpdated) return res.status(404).send({ok: false, msg:'An error occurred when updating the product'});
    const productFound = await ProductModel.findOne({id: productIdParam});
    if(!productFound) return res.status(404).send({ok: false, msg:`Product not found using the id ${productIdParam}`});

    return res.status(200).send({ok: false, msg:'product updated successfully', data: productUpdated});
};

const DeleteOneProductEndpoint = async (req,res) =>{
    const productIdParam = req.params['id']

    if(!productIdParam ) return res.status(404).send({ok: false, msg:'id is mandatory to delete one product'});

    const productFound = await ProductModel.findOne({id: productIdParam});
    if(!productFound) return res.status(404).send({ok: false, msg:`Product not found using the id ${productIdParam}`});

    const productDeleted = await DeleteOneProduct(productIdParam);
    if(!productDeleted) return res.status(404).send({ok: false, msg:'An error occurred when updating the product'});
    return res.status(200).send({ok: true, msg: `product with the id ${productIdParam} deleted successfully`});
};
//#endregion


//#region Methods
const ValidateProduct = (product) =>{
    if(!product) return undefined;
    if(!product.name) return undefined;
    if(!product.description) return undefined;
    if(!product.category) return undefined;
    if(!product.price) return undefined;
    if(!product.sku) return undefined;

    return product;
};

const GetAllProducts = async(filters) =>{

    if(!filters) return ProductModel.find();

    let query = ProductModel.find();

    const ProductInStock = await GetProductOnStock(filters.inStock== 'yes'? true: false);

    if(filters.inStock) query = query.where({id:{$in: ProductInStock}})
    if(filters.category) query = query.where('category').equals(filters.category);
    if(filters.minPrice) query = query.where('price').gte(filters.minPrice);
    if(filters.maxPrice) query = query.where('price').lte(filters.maxPrice);
    

    return query;
    
};

const GetProductOnStock= async (inStock) => {

    let allProducts = undefined
    if(inStock){
        allProducts = await InventoryModel.find().where('quantity').gt(0).select({'productId':1 , '_id':0});
    }else{
        allProducts = await InventoryModel.find().where('quantity').equals(0).select({'productId':1 , '_id':0});
    }

    if(!allProducts || allProducts.length ==0) return [];

    allProducts =  allProducts.map( p => p.productId);
    allProducts =  [...new Set(allProducts)];

    return allProducts && allProducts.length > 0? allProducts : [];
};

const GetOneProduct = async (productId) =>{
    const ProductFound = await ProductModel.findOne({id: productId});

    return ProductFound? ProductFound: undefined;
};

const UpdateOneProduct = async(ProductId, ProductBody) =>{
    const productUpdated = await ProductModel.findOneAndUpdate({id: ProductId},{...ProductBody,ProductId},{new:true})
    
    return productUpdated? productUpdated : undefined;
};


const DeleteOneProduct = async(ProductId) =>{
    const productDelted = await ProductModel.findOneAndDelete({id:ProductId});

    if(!productDelted) return undefined

    return true;
};



//#endregion

module.exports ={
    AddProductEndpoint,
    GetAllProductsEndpoint,
    GetOneProductEndpoint,
    UpdateOneProductEndpoint,
    DeleteOneProductEndpoint,

    ValidateProduct,
    GetAllProducts,
    GetOneProduct,
    UpdateOneProduct,
    DeleteOneProduct,
};