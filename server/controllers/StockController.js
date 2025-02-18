const InventoryModel = require("../models/InventoryModel");
const MoveModel = require("../models/MoveModel");


//#region Endpoints
const GetInventoryByStoreEndpoint = async(req,res) =>{
    const idStoreParam = req.params && req.params['id'];

    if(!idStoreParam) return res.status(404).send({ok:false, msg:'Store id is mandatory'});

    const StockByStore = await GetStockByStore(idStoreParam);

    if(!StockByStore || StockByStore.length ==0) return res.status(400).send({ok: false, msg:`no stock found on store ${idStoreParam}`});

    return res.status(200).send({ok: true, msg:`Inventory for store ${idStoreParam}`, data: StockByStore, length: StockByStore.length});
};

const TrasnferInventoryEndpoint = async(req,res) =>{
    
    const body = req.body?req.body : undefined;
    
    if(!body) return res.status(404).send({ok: false, msg:'body is required for maquing a transfer'});

    body.timestamp = new Date();
    const moveCreated = await new MoveModel(body).save();

    const isBodyValid = await ValidateTransferBody(body);

    if(!isBodyValid) return res.status(404).send({ok: false, msg:'body is not valid'});

    if(body && body.type  && body.type.toLowerCase() == 'transfer'){      
        const sourceStoreFound = await InventoryModel.findOne({storeId:body.sourceStoreId,productId:body.productId, quantity: {$gte: body.quantity}});
        
        if(!sourceStoreFound) return res.status(400).send({ok: false, msg:'source store dosent have enough products for transfer'})

        const resTransfer = await ApplyTransfer(body);
        
        if(!resTransfer) return res.status(400).send({ok: true, msg:'An error occurred while apply the transfer'});

        return res.status(200).send({ok: true, msg:'Transfer successfully', data: resTransfer});
    }else{
        const inventoryUpdated = await ApplyMove(body);

        if(!inventoryUpdated) return res.status(400).send({ok: false, msg:'An error occurred updating the inventory'});
        
        return res.status(200).send({ok:true, msg:'move done successfully', data:inventoryUpdated});
    }    
};

const GetInventoryAlertsEndpoint = async(req,res) =>{
    const StoresFound = await GetStoresInInventory()

    if(!StoresFound) return res.status(400).send({ok: false, msg:'no stores found in data base'});

    let fullInventoryAlerts = {}

    for(i=0; i< StoresFound.length; i++){
        const s = StoresFound[i];

        fullInventoryAlerts[s] = await GetAlertsByStore(s);
    }        

    if(!fullInventoryAlerts) return  res.status(400).send({ok: false, msg:'An error ocurred getting the alerts'});

    return res.status(200).send({ok:true, msg:'alerts found successfully', data:fullInventoryAlerts})

};
//#endregion

//#region Methods

const GetStockByStore = async(idStore) =>{

    if(!idStore) return undefined;

    const stock = await  InventoryModel.find().where('storeId').equals(idStore);
    
    return (stock && stock.length > 0) ? stock : undefined;
};

const GetStoresInInventory = async() =>{
    let stores = await InventoryModel.find().select({'storeId':1, '_id': 0});
    
    if(!stores || stores.length ==0) return [];
    stores = stores.map(s => s.storeId);
    stores = new Set(stores);
    stores = [...stores]

    return (stores && stores.length !=0)? stores: [];
};

const GetAlertsByStore = async (storeId) =>{
    const alerts = await InventoryModel.find({ storeId: storeId,  $expr: {$lte:['$quantity','$minStock']}});
    return  (alerts && alerts.length >0)? alerts : []
};

const ValidateTransferBody = async(body) =>{
    const type = (body && body.type)?  body.type.toLowerCase(): undefined;

    if(!body) return false;
    if(!body.productId) return false
    if(!body.sourceStoreId) return false
    if(!body.quantity || isNaN(body.quantity)) return false
    if(!type) return false

    
    if(type == 'transfer'){
        if(!body.targetStoreId) return false
    }

    return true;    
};

const ApplyMove = async(body) =>{
    const inventoryFound = await InventoryModel.findOne({storeId: body.sourceStoreId, productId: body.productId});
    if(!inventoryFound) return undefined;

    const oldQuantity = (inventoryFound && inventoryFound.quantity)? parseInt(inventoryFound.quantity) : 0;
    const bodyQuantity = (body && body.quantity)? parseInt(body.quantity) : 0;
    let  newQuantity = 0

    
    if(body && body.type && body.type.toLowerCase() == 'in'){
        newQuantity = oldQuantity + bodyQuantity
    }else if(body && body.type && body.type.toLowerCase() == 'out' && oldQuantity >= bodyQuantity){
        newQuantity =  oldQuantity - bodyQuantity
    }else{
        return undefined;
    }
    
    const newInventoryUpdated = await InventoryModel.findOneAndUpdate({_id: inventoryFound._id},{quantity: newQuantity },{new: true});

    return newInventoryUpdated? newInventoryUpdated : undefined;
};

const ApplyTransfer = async(body) =>{
    if(!body) return undefined;

    const type = (body.type && body.type.toLowerCase() == 'transfer')? body.type.toLowerCase() : undefined;

    const quantity = (body && body.quantity && !isNaN(body.quantity))? parseInt(body.quantity): 0;

    if(!quantity) return undefined;

    const sourceStoreId = (body.sourceStoreId)? body.sourceStoreId : undefined;
    const targetSourceId = (body.targetStoreId)? body.targetStoreId : undefined;
    const productId = (body.productId)? body.productId : undefined;

    if(!sourceStoreId || ! targetSourceId || !productId) return undefined

    const sourceStoreFound = await InventoryModel.findOne({storeId:sourceStoreId,productId:productId, quantity: {$gte: quantity}});
    const targerStoreFound = await InventoryModel.findOne({storeId:targetSourceId,productId:productId});    

    if(!sourceStoreFound || ! targetSourceId) return undefined;

    const newSourceQuantity = (sourceStoreFound.quantity)? sourceStoreFound.quantity- quantity : 0;
    const newTargetQuantity = (targerStoreFound.quantity)? targerStoreFound.quantity + quantity: quantity;

    const sourceStoreUpdated = await InventoryModel.findOneAndUpdate({_id: sourceStoreFound._id},{quantity: newSourceQuantity},{new: true});
    const targetStoreUpdated = await InventoryModel.findOneAndUpdate({_id: targerStoreFound._id},{quantity: newTargetQuantity},{new: true});

    let  res ={
        'source':sourceStoreUpdated,
        'target':targetStoreUpdated
    }

    return res 
};
//#endregion 





module.exports ={
    GetInventoryByStoreEndpoint,
    TrasnferInventoryEndpoint,
    GetInventoryAlertsEndpoint,

    GetStockByStore,
    GetAlertsByStore,
    ApplyTransfer,
    ApplyMove
};