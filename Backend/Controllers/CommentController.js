const Comment = require('../Models/Comments');
const Blog = require('../Models/Blog');
const Notification = require('../Models/Notification');

const addComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = new Comment({
      user: req.user.id,
      blog: req.params.id,
      content
    });
    await comment.save();

    // Create notification for the blog author
    const blog = await Blog.findById(req.params.id).populate('author');
    if (blog && blog.author._id.toString() !== req.user.id) {
      const notification = new Notification({
        user: blog.author._id,
        type: 'Comment',
        message: `${req.user.username} commented on your blog: ${blog.title}`,
        relatedBlog: blog._id,
        relatedUser: req.user.id
      });
      await notification.save();
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addComment, getComments };