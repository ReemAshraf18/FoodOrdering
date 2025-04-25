const express = require('express');
const router = express.Router();
const { createBlog, updateBlog, deleteBlog, getBlogs, getBlog, searchBlogs,deleteBlogPhoto  } = require('../Controllers/BlogController');
const { auth, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: '$_id', _id: 0 } }
    ]);
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, restrictTo('Vendor'), upload.array('photos', 5), createBlog);
router.put('/:id', auth, restrictTo('Vendor'), upload.array('photos', 5), updateBlog);
router.delete('/:id', auth, restrictTo('Vendor'), deleteBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.get('/search', (req, res, next) => {
  const { auth } = require('../middleware/auth');
  auth(req, res, searchBlogs);
});

router.delete('/:blogId/photos/:photoPath', 
  auth,
  restrictTo('Vendor'),
  deleteBlogPhoto
);

module.exports = router;