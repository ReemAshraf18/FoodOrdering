const Like = require('../Models/Like');
const Blog = require('../Models/Blog');
const Notification = require('../Models/Notification');

const likeBlog = async (req, res) => {
  try {
    const like = new Like({
      user: req.user.id,
      blog: req.params.id
    });
    await like.save();

    // Create notification for the blog author
    const blog = await Blog.findById(req.params.id).populate('author');
    if (blog && blog.author._id.toString() !== req.user.id) {
      const notification = new Notification({
        user: blog.author._id,
        type: 'Like',
        message: `${req.user.username} liked your blog: ${blog.title}`,
        relatedBlog: blog._id,
        relatedUser: req.user.id
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Liked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikeBlog = async (req, res) => {
  try {
    await Like.deleteOne({ user: req.user.id, blog: req.params.id });
    res.json({ message: 'Unliked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { likeBlog, unlikeBlog };