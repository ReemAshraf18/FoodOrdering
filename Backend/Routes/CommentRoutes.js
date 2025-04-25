const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../Controllers/CommentController');
const { auth, restrictTo } = require('../middleware/auth');


router.post('/:id', auth, restrictTo('Client'), addComment);
// router.delete('/:id', auth, restrictTo('Client'), unlikeBlog);
router.get('/:id', getComments);

module.exports = router;