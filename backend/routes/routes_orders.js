const express = require('express');
const { pending, Orders, userOrders, orderProduct, deliver} = require('../controllers/ordersController');
const { verifyToken } = require('../middleware/jwtAuthenticate');
const { authorizeRole } = require('../middleware/roleMiddleware');


const router = express.Router();

router.get('/pending', verifyToken, pending);

router.get('/allOrders', verifyToken, authorizeRole('ADMIN', 'MANAGER'), Orders)

router.get('/userOrders', verifyToken, userOrders)

router.post('/orderProduct', verifyToken, orderProduct);

router.put('/deliver', verifyToken, authorizeRole('ADMIN', 'MANAGER'), deliver)






module.exports = router;