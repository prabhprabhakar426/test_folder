const inventoryModel = require('../model/inventoryModel');
const ordersModel = require('../model/ordersModel');

async function placeOrder(orderDetails){
    try{
        
        const [product] = await inventoryModel.getProduct(orderDetails.productId)

        if(!product){
            throw new Error('Product Not Found');
        }
        if(orderDetails.quantity > product.totalStock){
            throw new Error('Insufficient Stock');
        }
        console.log('found product')
        console.log(product)
    
        return ordersModel.buyProduct(orderDetails);
    }
    catch(error){
        console.log(error.message + ' place order');
        throw error;
    }
}

module.exports = {placeOrder}