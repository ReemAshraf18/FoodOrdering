const express = require('express');
const router = express.Router();
const { placeOrder, getVendorOrders, updateOrderStatus } = require('../Controllers/OrderController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/:id', auth, restrictTo('Client'), placeOrder);

router.get('/:id', auth, restrictTo('vendor'), placeOrder);

router.put('/:id', auth, restrictTo('vendor'), placeOrder);


module.exports = router;