const userModel= require('../model/userModel')
const ordersModel = require('../model/ordersModel')
const { validator } = require('../validations/validationSchema')
const AppError = require('../error/AppError')
const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken');

const registerUser = async(req, res, next)=>{

    try{console.log(req.body);
        await validator(req.body);
        console.log('body: '+req.body);
        const response = await userModel.addNewUser(req);
        res.status(201).json({
                status : "success",
                statusCode : 201,
                message : "User added",
                data: response
        });
    }
    catch(error){
        console.log(error.message);
        error.status = error.status || 500;
        next(error);
    }
}

const loginUser = async(req, res, next)=>{
    try{
        // console.log('login server' + req.body)
        const response = await userModel.checkUserLogin(req);
        console.log('refresh Token: ' , response.refreshToken)
        res.cookie('refreshToken', response.refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        console.log(res.cookies)
        res.status(201).json({
                status : "success",
                statusCode : 200,
                message : "Valid user",
                accessToken : response.accessToken,
        });
    }
    catch(error){
        console.log(error.message);
        error.status = error.status || 500;
        next(error);
    }
}

const getAllUsers = async(req, res, next)=>{
    try{
        console.log(req.user)
        const response = await userModel.allUsers(req.user.email);
        console.log(response)
        res.json(response);
    }
    catch(error){
        console.log('fetch all users error' + error.message);
        error.status = error.status || 500;
        next(error);
    }
}

// user details for profile
const getUser = async(req, res, next)=>{
    try{
        const id = req.query.id;
        const response = await userModel.getUserById(id);
        console.log(response)
        res.json(response);
    }
    catch(error){
        console.log('fetch all users error' + error.message);
        error.status = error.status || 500;
        next(error);
    }
}
//user dashboard data
const userDashboard = async(req, res, next) =>{
    try{
        const userId = req.query.id;
        const userName = req.query.name;
        const orders = await ordersModel.allUserDashboard(userId, userName);
        console.log('user Dashboard')
        res.status(200).json(orders);
    }
    catch(error){
        console.log(error.message);
        error.status = error.status || 500;
        next(error);
    }
}

const deleteUser = async(req, res, next) => {
    try{
        const {id} = req.body;
        const response = await userModel.deleteUserById(id);
        if(response.affectedRows === 0){
            res.status(200).json({message:'User Not Found'})
        }
        res.status(200).json({message: `${response.affectedRows} records deleted`});
    }
    catch(error){
        // console.error(error);
        error.status = error.status || 500;
        next(error);
    }
}

const refresh = (req, res, next)=>{
    // const refreshToken = req.cookie.refreshToken;
    try{
        const refreshToken = req.cookies.refreshToken;
        console.log('refresh method', req.cookies.refreshToken)
        if(!refreshToken){
            return res.status(403).json({message: 'Refresh Token Not Found'})
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET,(error, decoded) =>{
            if(error){
                return res.status(403).json({message: 'refresh Token is invalid Login again'})
            }
            const user = decoded;

            const accessToken = userModel.generateToken(user);
            return res.status(200).json({accessToken});
        })
    }
    catch(error){
        console.log('Refresh error',error.message);
        next(error);
    }
}

const logout = (req, res) =>{
    res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

    console.log('Logout')

    return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = {registerUser, loginUser, getAllUsers,userDashboard, deleteUser, getUser, refresh,logout}