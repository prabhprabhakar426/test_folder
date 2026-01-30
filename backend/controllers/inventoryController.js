const inventoryModel = require('../model/inventoryModel')
const userModel = require('../model/userModel');
const ordersModel = require('../model/ordersModel');
const {validator} = require('../validations/validationSchema');
const path = require('path');
const fs = require('fs');


const getAll = async(req, res, next) => {
    try{
        console.log('all product')
        const response = await inventoryModel.getAllProducts(req);
        const result = response.map(p => ({
            id: p.id,
            productName: p.productName,
            price: p.price,
            totalStock: p.totalStock,
            productImage: `${req.protocol}://${req.get("host")}/uploads/productphotos/${p.productImage}`
        }));


        console.log('constroller',result)
        res.status(200).json(result);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const get = async(req, res, next) => {
    try{
        const {id} = req.params;
        console.log('params' + id)
        const response = await inventoryModel.getProduct(id);
        res.status(200).json({
                status : "success",
                statusCode : 200,
                message : "Product Found",
                data: response
        }); 
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const add = async(req,res,next) =>{
    try{
        // validating the incoming data
        // await validator(req.body);
        
        const response = await inventoryModel.addProduct(req); 
        res.status(201).json({
                status : "success",
                statusCode : 201,
                message : "Product added"
        });
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const update = async(req, res, next) => {
    try{
        console.log('controller')
        const updatedProduct = req.body;
        const {id} = req.body;
        const response = await inventoryModel.updateProduct(id,updatedProduct);
        res.status(200).json({
                status : "success",
                statusCode : 200,
                message : "Product updated"
        });
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const remove = async(req, res, next) =>{
    try{
        
        console.log(req.body.id)
        const {id} = req.body;
        const response = await inventoryModel.removeProduct(id)
        res.status(200).json({
                status : "success",
                statusCode : 200,
                message : "Product Deleted",
                deletedRows: response
        });
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const adminDashboard = async(req, res, next) => {
    try{
        const totalProducts = await inventoryModel.totalProductCount();
        const lowStock = await inventoryModel.lowStockCount();
        const totalUsers = await userModel.totalUsersCount();
        const pending = await ordersModel.allPendingOrders();
        const totalRevnue = await ordersModel.totalRevnue();

        const response = {
            totalProducts,
            lowStock,
            totalUsers,
            pending,
            totalRevnue
        }

        console.log(response);
        res.status(200).json(response);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const managerDashboard = async(req, res, next) => {
    try{
        const totalProducts = await inventoryModel.totalProductCount();
        const lowStock = await inventoryModel.lowStockCount();
        const pending = await ordersModel.allPendingOrders();

        const response = {
            totalProducts,
            lowStock,
            pending,
        }

        console.log(response);
        res.status(200).json(response);
    }
    catch(error){
        console.log(error.message);
        next(error);
    }
}

const getImage = async(req, res, next)=> {
    try{
        const filePath =  req.params.filename;
        const actualPath = path.resolve(filePath);
        console.log('File path: ', actualPath)
        if (fs.existsSync(actualPath)) {
            res.sendFile(actualPath);
        } else {
            res.status(404).send("Image not found");
        }
    }catch(error){
        console.log(error.message);
        next(error);
    }
}

module.exports = {getAll, get, add, update, remove, adminDashboard, managerDashboard, getImage}