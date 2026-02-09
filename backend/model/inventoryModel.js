const db = require("../config/database");
const AppError = require('../error/AppError');
const {deleteImage} = require('../middleware/photoUploads');

async function getAllProducts(req){
    try{
        const query = "SELECT id, productName, price, category, totalStock, productImage FROM inventory";
        const [rows] = await db.query(query);
        // console.log(rows);
        return rows;
    }
    catch(error){
        next(error);
    }
}

async function getProduct(id){
    try{
        const query = "SELECT productName, price, category, totalStock, productImage FROM inventory WHERE id = ? LIMIT 1";
        const [rows] = await db.query(query,[id]);
        if(!rows || rows.length === 0){
            throw new AppError(404,'BUSINESS', 'Product Not Found')
        }
        return rows;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function getProductByName(pName){
    try{
        console.log('get by name', pName)
        const query = "SELECT id, totalStock FROM inventory WHERE productName = ? LIMIT 1";
        const [rows] = await db.query(query,[pName]);
        if(rows === undefined){
            throw new AppError(404,'BUSINESS', 'User Not Found');
        }
        console.log(rows);
        return rows;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function addProduct(req){
    try{
        const {productName, price, category, totalStock} = req.body;
        const image = req.file;
        console.log('image Path: ', req);
        const query = "INSERT INTO inventory(productName, price, category, totalStock, productImage, createdOn, updatedOn) values(?, ?, ?, ?, ?, NOW(), NOW())";
        const result = await db.query(query, [productName, price, category, totalStock, image.filename]);

        if(!result.affectedRow === 1){
            throw new AppError(400,'BUSINESS','Inserting Product Error');
        }
        return;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function updateProduct(id, req){
    try{
        console.log(id + ' inven model')
        console.log('update product : ',req)
        
        const [found] = await getProduct(id);
        if(found === undefined){
            throw new AppError(404,'BUSINESS', " Product Not Found");
        }

        req.productImage = req.file ? req.file.filename : undefined;
        const columnsInTable = ['productName', 'price', 'category', 'totalStock', 'status', 'productImage'];
        const columnData = req;
        const columnToUpdate = [];
        const values = [];

        for(const column of columnsInTable){
            if(columnData[column] !== undefined){
                columnToUpdate.push(`${column}=?`);
                values.push(columnData[column]);
            }
        }
        console.log('values');
        // console.log(values);
        if (columnToUpdate.length === 0) {
            throw new AppError(400, 'BUSINESS', "No Data to Update");
        }
        // console.log('values2');
        values.push(id);
        const query = `UPDATE inventory SET ${columnToUpdate.join(', ')}, updatedOn = NOW() WHERE id = ?`;
        const [rows] = await db.query(query, values);
        console.log('values3');
        console.log(rows.affectedRows);
        return rows.affectedRows;
    }
    catch(error){
        console.log(error.message + 'inventory model');
        throw error;
    }
}

async function removeProduct(id, req){

    try{
        console.log(id)
        const product = await getProduct(id);
        console.log('file name: ', product);
        const fileName = product[0].productImage;
        console.log('file name: ', fileName);
        // delete the image of the product
        await deleteImage(req,fileName);

        const query = "DELETE FROM inventory WHERE id =?";
        const [rows] = await db.query(query, [id]);
        if(rows.affectedRows === 0){
            throw new AppError(400, 'BUSINESS', "Product Not Found");
        }
        console.log('remove product: ',rows.affectedRows);
        return rows.affectedRows;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function totalProductCount(){
    try{
        const query = " SELECT COUNT(id) as TotalProducts FROM inventory";
        const [rows] = await db.query(query);
        if(!rows || rows.length === 0){
            throw new AppError(400, 'BUSINESS', "Product Not Found");
        }
        return rows[0].TotalProducts;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function lowStockCount(){
    try{
        const query = " SELECT COUNT(id) as LowStock FROM inventory WHERE totalStock <= 10";
        const [rows] = await db.query(query);
        if(!rows || rows.length === 0){
            throw new AppError(400, 'BUSINESS', "Product Not Found");
        }
        return rows[0].LowStock;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}
module.exports = {addProduct, getAllProducts,getProductByName, getProduct, updateProduct, removeProduct, totalProductCount, lowStockCount}