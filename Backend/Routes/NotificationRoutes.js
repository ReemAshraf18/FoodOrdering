const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

const { getNotifications, markAsRead } = require('../Controllers/NotificationController');

router.get('/', auth, getNotifications);

router.put('/:id/read', auth, getNotifications);
module.exports = router;