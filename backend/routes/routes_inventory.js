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




module.exports = router;