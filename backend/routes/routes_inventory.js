const express = require('express');
const {getAll, get, add, update, remove, adminDashboard, managerDashboard, getImage} = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/jwtAuthenticate');
const { authorizeRole } = require('../middleware/roleMiddleware');
const {upload} = require('../middleware/photoUploads');

// router object
const router = express.Router();

router.get('/get', verifyToken, getAll);

router.get('/get/:id',verifyToken, get);

router.post('/add',verifyToken, authorizeRole('ADMIN', 'MANAGER'),upload.single('productImage'), add);

router.put('/update/',verifyToken,authorizeRole('ADMIN', 'MANAGER'),upload.single('image'), update);

router.delete('/delete/', verifyToken, authorizeRole('ADMIN'), remove);

router.get('/dashboard', verifyToken, authorizeRole('ADMIN'), adminDashboard)

router.get('/managerDashboard',verifyToken, managerDashboard)

// router.get('/productImage/:filename',verifyToken, getImage); 

//POST for user Register or SignUp
// router.post('/register');
//GET all students router
// router.get('/getAllStudent',getAllStudents);

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