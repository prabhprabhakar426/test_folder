const db = require('../config/database');
const inventoryModel = require('../model/inventoryModel')
const AppError = require('../error/AppError')

async function allPendingOrders(){
    try{
        const query = 'SELECT COUNT(status) as Pending FROM orders WHERE status = "PENDING" ';
        const [rows] = await db.query(query);
        console.log(rows[0]);
        return rows[0].Pending;
    }catch(error){
        console.log(error.message);
        throw error;
    }
}
// All orders for Admin & Manager
async function allOrders(){
    try{
        const query = 'SELECT id, userId, productName, quantity, price, totalPrice, status FROM orders';
        const [rows] = await db.query(query);
        console.log(rows);
        return rows;
    }catch(error){
        console.log(error.message);
        throw error;
    }
}

// All orders for user orders
async function allUserOrders(id){
    try{
        const query = 'SELECT id, userId, productName, quantity, price, totalPrice, status FROM orders WHERE userId = ?';
        const [rows] = await db.query(query, [id]);
        console.log(rows);
        return rows;
    }catch(error){
        console.log(error.message);
        throw error;
    }
}

// user dashboard data
async function allUserDashboard(id, name){
    try{
        const pendingQuery = 'SELECT COUNT(*) as Pending FROM orders WHERE status = ? AND  userId = ?';
        const [pending] = await db.query(pendingQuery, ['PENDING', id]);
        const deliveredQuery = 'SELECT COUNT(*) as Delivered FROM orders WHERE name = ? AND  userId = ? ';
        const [delivered] = await db.query(deliveredQuery, [name, id]);

        console.log(pending )
        console.log(delivered )
        return {pending: pending[0].Pending, delivered:delivered[0].Delivered}
    }catch(error){
        console.log(error.message);
        throw error;
    }
}

async function totalRevnue(){
    try{
        const query = 'SELECT SUM(totalPrice) as Revnue FROM orders WHERE status = "DELIVERED"';
        const [revnue] = await db.query(query);
        return Number(revnue[0].Revnue);
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function buyProduct(orderDetails){
    try {
        console.log('details');
        console.log(orderDetails);
        const values = [orderDetails.userId, 
            orderDetails.userName, 
            orderDetails.productName,
            orderDetails.quantity,
            orderDetails.price,
            orderDetails.totalPrice];
            console.log(values);
        const query = `INSERT INTO orders 
        (userId, name, productName, quantity, price, totalPrice) VALUES(?, ?, ?, ?, ?, ?)`;
        const result = await db.query(query,values);
        if(result.affectedRow === 0){
            throw new AppError(400, 'BUSINESS', 'Buy Product Failed')
        }
        return result.affectedRow ;
    } catch (error) {
        console.log('order Product' + error.message);
        throw error;
    }
}

async function deliverProduct(order){
    try{
        const [product] = await inventoryModel.getProductByName(order.productName);
        if(!product){
            throw new AppError(400, 'BUSINESS', 'Product Not Found')
        }
        const updateDetail = {
            totalStock: product.totalStock - order.quantity
        }
        console.log(order.id + 'model');
        const query = "UPDATE orders SET status = 'DELIVERED' where id = ?";
        const [rows] = await db.query(query,[order.id]);
        if(rows.affectedRow === 0){
            throw new AppError(400, 'BUSINESS', 'Updation Failed')
        }
        await inventoryModel.updateProduct(product.id,updateDetail );

    }catch(error){
        console.log(error.message);
        throw error;
    }
}

async function cancelProduct(order){
    try{
        const query = "UPDATE orders SET status = 'CANCELLED' where id = ?";
        const [rows] = await db.query(query,[order.id]);
        if(rows.affectedRow === 0){
            throw new AppError(400, 'BUSINESS', 'Cancel Order Failed')
        }
    }catch(error){
        console.log('cancel model', error.message);
        throw error;
    }
}

module.exports = {allPendingOrders, allUserDashboard, totalRevnue, allUserOrders, allOrders, buyProduct, deliverProduct, cancelProduct}