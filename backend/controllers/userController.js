const userModel= require('../model/userModel')
const ordersModel = require('../model/ordersModel')
const { validator } = require('../validations/validationSchema')
const AppError = require('../error/AppError')
const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken');

// user registration function
const registerUser = async(req, res, next)=>{

    try{console.log(req.body);
        await validator(req.body);
        console.log('body: '+req.body);
        const response = await userModel.addNewUser(req)
        res.status(201).json({
                status : "success",
                statusCode : 201,
                message : "User added",
                data: response
        });
    }
    catch(error){
        console.log('register user error: ', error.message);
        error.status = error.status || 500;
        next(error);
    }
}

// user login function
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

// get all users function
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
        
        if (response.profilePath) {
            response.profileUrl = req.protocol + '://' + req.get('host') + '/uploads/profilephotos/'+ response.profilePath;
        }   
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

// add profile picture function
const addProfilePicture = async(req, res, next) =>{
    try{
        const id = req.query.id;
        console.log('User ID for profile pic upload: ', id);
        console.log('File info: ', req.file);
        const response = await userModel.uploadProfilePhoto(id, req.file);
        res.status(200).json({
            status : "success",
            statusCode : 200,
            message : "Profile Photo Updated",
            data: response
    });
    }
    catch(error){
        console.log(error.message);
        error.status = error.status || 500;
        next(error);
    }
}

// delete user function
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

// refresh token function
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

const updateUser = async(req, res, next) =>{
    try{
        const {id} = req.body;
        const data = req.body;
        if(data.confirmPassword){
           const isPasswordValid = await userModel.checkUserPassword(data.id, data.confirmPassword);
           if(!isPasswordValid){
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Invalid Password"
            });
           }
        }
        const response = await userModel.updateUser(id, data);
        res.status(200).json({
            status : "success",
            statusCode : 200,
            message : "User Updated",
            data: response
        });
    }
    catch(error){
        console.log(error.message);
        error.status = error.status || 500;
        next(error);
    }
}

// logout function
const logout = (req, res) =>{
    res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });

    console.log('Logout')

    return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = {updateUser, addProfilePicture, registerUser, loginUser, getAllUsers,userDashboard, deleteUser, getUser, refresh,logout}