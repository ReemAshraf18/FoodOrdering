const Order = require('../Models/Order');
const Blog = require('../Models/Blog');
const Notification = require('../Models/Notification');

const placeOrder = async (req, res) => {
  try {
    const order = new Order({
      client: req.user.id,
      blog: req.params.id
    });
    await order.save();

    // Create notification for the blog author
    const blog = await Blog.findById(req.params.id).populate('author');
    if (blog && blog.author._id.toString() !== req.user.id) {
      const notification = new Notification({
        user: blog.author._id,
        type: 'Order',
        message: `${req.user.username} placed an order for your dish: ${blog.title}`,
        relatedBlog: blog._id,
        relatedUser: req.user.id
      });
      await notification.save();
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add functions for managing orders (to be implemented later in Step 2)
const getVendorOrders = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).select('_id');
    const blogIds = blogs.map(blog => blog._id);
    const orders = await Order.find({ blog: { $in: blogIds } })
      .populate('client', 'username')
      .populate('blog', 'title');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id).populate('blog');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getVendorOrders, updateOrderStatus };