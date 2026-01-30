//importing the express package
const express = require("express");
const dbconnection = require("./config/database");
const globalErrorHandling = require("./error/globalErrorHandler");
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser')

//passing all the methods to variable 'app'
const app = express();


const corsOption = {
    origin:'http://localhost:3000' ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOption));

app.use(cookieParser());

// accepts json objects
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// user routes
app.use('/user', require('./routes/routes_user'));

app.use('/orders', require('./routes/routes_orders'));

app.use('/inventory', require('./routes/routes_inventory'))

app.get('/get',(req, res)=>{
    console.log('get API working');
    res.send('get API working');
})

// API Not Found error handler
app.use((req, res, next)=>{
    const error = new Error('URL is Not Found');
    error.status = 404;
    next(error);
})



//starting the server a port 8080
try {
    app.listen(8080,() => {
        console.log('Server is running on http://localhost:8080')
    });
} catch (error) {
    console.log(error.message);
}

// establishing database connection
dbconnection.query('SELECT 1').then(()=> {
    console.log('database connected');
}).catch((error) => {
    console.log(error);
});

// console.log(Date())

//global handler middleware
app.use(globalErrorHandling);