const Blog = require('../Models/Blog');
const User = require('../Models/User');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

const createBlog = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    let photos = [];
    if (req.files && req.files.length > 0) {      
      photos = req.files.map(file => path.join('uploads', file.filename));
      
      // const uploadPromises = req.files.map(file => 
      //   cloudinary.uploader.upload(file.path, { folder: 'blog_photos' })
      // );
      // const results = await Promise.all(uploadPromises);
      // photos = results.map(result => result.secure_url);
      // req.files.forEach(file => fs.unlinkSync(file.path)); // حذف الملف المؤقت
    }

    const blog = new Blog({
      title,
      body,
      photos,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await blog.save();

 if (req.files && req.files.length > 0) {
    req.files.forEach(file => fs.unlinkSync(file.path));
  }
  
  return res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    return res.status(500).json({ 
      message: 'Failed to create blog',
      error: err.message 
    });
  }
}


const updateBlog = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(403).json({ message: 'Not authorized' });
    }

    let photos = [...blog.photos]; 

    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => {
        return path.join('uploads', path.basename(file.path));
      });
      photos = [...photos, ...newPhotos];
    }
    blog.title = title || blog.title;
    blog.body = body || blog.body;
    blog.photos = photos;
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;
    blog.updatedAt = Date.now();

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
        if (req.files && req.files.length > 0) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    
    res.status(500).json({ 
      message: 'Failed to update blog',
      error: err.message 
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (blog.photos.length > 0) {
      blog.photos.forEach(photoPath => {
        const fullPath = path.join(__dirname, '../', photoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog and all its photos deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ 
      message: 'Failed to delete blog',
      error: err.message 
    });
  }
};

const deleteBlogPhoto = async (req, res) => {
  try {
    const { blogId, photoPath } = req.params;
    const blog = await Blog.findById(blogId);
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.photos = blog.photos.filter(p => p !== photoPath);
    await blog.save();

    const fullPath = path.join(__dirname, '../', photoPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    res.json({ message: 'Photo deleted successfully', updatedBlog: blog });
  } catch (err) {
    console.error('Error deleting blog photo:', err);
    res.status(500).json({ 
      message: 'Failed to delete photo',
      error: err.message 
    });
  }
};

const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments();

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchBlogs = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query is required' });

  try {
    const regex = new RegExp(q, 'i'); 
    const users = await User.find({ username: regex }).select('_id');
    const userIds = users.map(user => user._id);

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: regex } },
        { tags: { $regex: regex } },
        { author: { $in: userIds } }
      ]
    }).populate('author', 'username');
    
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { createBlog, updateBlog, deleteBlog, getBlogs, getBlog, searchBlogs,deleteBlogPhoto  };