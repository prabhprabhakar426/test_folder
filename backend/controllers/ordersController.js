const ordersModel = require('../model/ordersModel');
const orderServices = require('../services/orderServices');

// all pending orders
const pending = async(req, res, next) => {
    try{
        const response = await ordersModel.allPendingOrders();
        console.log(response)
        res.status(200).json(response);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const Orders = async(req, res, next) => {
    try{
        console.log('orders req:  ',req.cookies)
        const response = await ordersModel.allOrders();
        console.log(response)
        res.status(200).json(response);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const userOrders = async(req, res, next) => {
    try{
        const id = req.query.id;
        console.log(id)
        const response = await ordersModel.allUserOrders(id);
        console.log(response)
        res.status(200).json(response);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const orderProduct = async(req, res, next) =>{
    try{
        const orderDetails = req.body;
        const orderResponse = await orderServices.placeOrder(orderDetails);
        res.status(201).json({message: 'Order Placed'});
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const deliver = async(req, res, next) => {
    try{
        const order = req.body;
        console.log('controller')
        const response = await ordersModel.deliverProduct(order);
        res.status(200).json({message: 'Product Delivered'})
    }catch(error){
        console.log(error.message);
        next(error);
    }
}

module.exports = {pending, Orders, userOrders, orderProduct, deliver}