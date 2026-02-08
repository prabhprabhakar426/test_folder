const express = require('express');
const { updateUser, registerUser, loginUser, getAllUsers, userDashboard, deleteUser, getUser, refresh, logout, addProfilePicture} = require('../controllers/userController');
const { verifyToken } = require('../middleware/jwtAuthenticate');
const { authorizeRole } = require('../middleware/roleMiddleware');
const {upload} = require('../middleware/photoUploads');


// router object
const router = express.Router();

//POST for user Register or SignUp
router.post('/register',registerUser);

//POST for Login 
router.post('/login', loginUser);

//GET all Users router
router.get('/getAllUsers',verifyToken,authorizeRole('ADMIN', 'MANAGER'), getAllUsers);

router.get('/dashboard',verifyToken, userDashboard)

router.get('/getUser', verifyToken,getUser)

router.delete('/delete', verifyToken, authorizeRole('ADMIN'), deleteUser);

router.post('/refresh',refresh);

router.post('/logout', verifyToken, logout);

router.put('/update', verifyToken, updateUser);

router.put('/uploadProfilePhoto/', verifyToken, upload.single('profileImage'), addProfilePicture);
//GET Student by id
// router.get('/getStudent/:id', getStudentById);

// Post (inserting student data) 
// router.post('/addStudent',addStudent);

//PUT for updating the student data
// router.put('/updateStudent/:Id',updateStudentData);

//Delete the student using ID
// router.delete('/deleteStudent/:Id', deleteStudent);

// API for adding profile picture
// router.post("/uploadProfilePhoto/:Id", addProfilePicture);

// API for retrieving the profile picture
// router.get("/getProfilePhoto/:Id", showProfilePhoto);

module.exports = router;