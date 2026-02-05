const db = require("../config/database");
const jwt = require('jsonwebtoken');
const AppError = require('../error/AppError')
const bcrypt = require('bcrypt');
const { getUser } = require("../controllers/userController");
const salt = 10;

// user registration function
async function addNewUser(req){
    try{
        const {name, email, password, role = 'USER'} = req.body;
        const emailExists = await getUserByEmail(email);
        if(emailExists){
            throw new AppError(409, 'BUSINESS', 'Email already exists')
        }
        const hasedPassword = await bcrypt.hash(password, salt);
        const query = "INSERT INTO user_table(name, email, password, role, createdOn) values(?, ?, ?, ?, NOW())"
        const [result] = await db.query(query, [name, email, hasedPassword, role, ]);
        if(result.affectedRows === 0){
            throw new AppError(409, 'BUSINESS', 'Adding New User Failed')
        }
        return result[0];
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

// user login function
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

// check password for given user id for protected operations
async function checkUserPassword(id, password){
    try{
        const query = "SELECT password from user_table WHERE id = ?"
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            throw new AppError(404, 'BUSINESS', 'User Not Found')
        }
        const storedHashedPassword = rows[0].password;
        const match = await bcrypt.compare(password, storedHashedPassword);
        return match;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

// fetch all users function
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

// fetch user by id function
async function getUserById(id){
    try{
        const query = 'SELECT  id, name, email, role, createdOn, profilePath FROM user_table WHERE id = ?';
        const [rows] = await db.query(query,[id]);
        // console.log(rows)
        return rows[0];
    }
    catch(error){
        console.log('fetch all error ' + error.message);
        throw error;
    }
}

async function getUserByEmail(email){
    try{
        const query = 'SELECT  id, name, email, role, createdOn FROM user_table WHERE email = ?';
        const [rows] = await db.query(query,[email]);
        // console.log(rows)
        if(rows.length === 0){
            return false;
        }
        else {
            return true
        }
    }
    catch(error){
        console.log('fetch user by email error ' + error.message);
        throw error;
    }
}


// total users count function
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

// user update function
async function updateUser(id, data){
    try{
        console.log(id + ' user model')
        // console.log(req)
        const found = await getUserById(id);
        console.log('after getUserById  ', found)
        if(found === undefined){
            throw new AppError(404,'BUSINESS', " User Not Found");
        }

        const columnsInTable = ['name', 'password', 'email'];
        const columnData = data;
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
        const query = `UPDATE user_table SET ${columnToUpdate.join(', ')} WHERE id = ?`;
        const [rows] = await db.query(query, values);
        console.log('values3');
        // console.log(rows.affectedRows);
        return rows.affectedRows;
    }
    catch(error){
        console.log(error.message , 'user model');
        throw error;
    }
}

// upload profile photo function
async function uploadProfilePhoto(id, file){
    try{
        const query = 'UPDATE user_table SET profilePath = ? WHERE id = ?';
        const [result] = await db.query(query, [file.filename, id]);
        return result;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

// generate JWT token function
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

// generate refresh token function
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

// delete user by id function
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

module.exports = {checkUserPassword, updateUser, uploadProfilePhoto, addNewUser, checkUserLogin, allUsers, totalUsersCount, deleteUserById, getUserById, generateToken}