const db = require('mysql2/promise')

const config = {
    user : 'root',
    password : 'Prabh@ppu777',
    database : 'inventory_management',
    host : process.env.HOST,
    port : process.env.PORT,
    timezone : '+05:30',
    dateStrings : true
};

const dbconnection = db.createPool(config)

module.exports = dbconnection;