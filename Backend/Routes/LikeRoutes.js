const express = require('express');
const router = express.Router();
const { likeBlog, unlikeBlog } = require('../Controllers/LikeController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/:id', auth, restrictTo('Client'), likeBlog);
router.delete('/:id', auth, restrictTo('Client'), unlikeBlog);


module.exports = router;