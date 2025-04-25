const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getFeed } = require('../Controllers/FollowController');
const { auth } = require('../middleware/auth');

router.post('/:id', auth, followUser);
router.delete('/:id', auth, unfollowUser);
router.get('/feed', auth, getFeed);

module.exports = router;