const db = require("../config/database");
const jwt = require('jsonwebtoken');
const AppError = require('../error/AppError')
const bcrypt = require('bcrypt');
const salt = 10;

async function addNewUser(req){
    try{
        const {name, email, password, role = 'USER'} = req.body;
        const hasedPassword = await bcrypt.hash(password, salt);
        const query = "INSERT INTO user_table(name, email, password, role, createdOn) values(?, ?, ?, ?, NOW())"
        const [result] = await db.query(query, [name, email, hasedPassword, role, ]);
        if(result.affectedRows === 0){
            throw new AppError(400, 'BUSINESS', 'Adding New User Failed')
        }
        return result[0];
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function checkUserLogin(req){
    try{
        const {email, password} = req.body;
        // console.log('check User Login '+email + ' '+ password)
        const query = "SELECT id, name, password, email, role from user_table WHERE email = ?"
        const [rows] = await db.query(query, [email]);
        
        if (rows.length === 0) {
            throw new AppError(404, 'BUSINESS', 'User Not Found')
        }
        const user = rows[0];
        const storedHashedPassword = rows[0].password;
        // console.log(storedHashedPassword)
        const match = await bcrypt.compare(password, storedHashedPassword);
        if(match){
            console.log('login success');
            return {
                accessToken: generateToken(user),
                refreshToken: generateRefreshToken(user)
            };
        }
        else{
            throw new AppError(401, 'AUTHENTICATION', 'Password Mismatch')
        }
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

async function allUsers(email){
    try{
        const query = 'SELECT id, name, email FROM user_table WHERE email <> ?';
        const [rows] = await db.query(query, [email]);
        // console.log(rows)
        return rows;
    }
    catch(error){
        console.log('fetch all error ' + error.message);
        throw error;
    }
}

async function getUserById(id){
    try{
        const query = 'SELECT  name, email, role, createdOn FROM user_table WHERE id = ?';
        const [rows] = await db.query(query,[id]);
        // console.log(rows)
        return rows[0];
    }
    catch(error){
        console.log('fetch all error ' + error.message);
        throw error;
    }
}

async function totalUsersCount(){
    try{
        const query = 'SELECT COUNT(id) as TotalUsers FROM user_table'
        const [response] = await db.query(query);
        return response[0].TotalUsers;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1m'}
    );
}

function generateRefreshToken(user){
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1 days'}
    );
}

async function deleteUserById(id){
    try{
        const query = 'DELETE FROM user_table WHERE id = ?';
        const [result] = await db.query(query,[id]);
        return result;
    }
    catch(error){
        console.log(error.message);
        throw error
    }
}

module.exports = {addNewUser, checkUserLogin, allUsers, totalUsersCount, deleteUserById, getUserById, generateToken}