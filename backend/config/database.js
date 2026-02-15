const db = require('mysql2/promise')

const config = {
    user : 'root',
    password : 'root', // root for office lap & personal lap 8056 edited
    database : 'inventory_management',
    host : process.env.HOST,
    port : process.env.PORT,
    timezone : '+05:30',
    dateStrings : true
};

const dbconnection = db.createPool(config)

module.exports = dbconnection;