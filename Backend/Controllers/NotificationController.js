const Notification = require('../Models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('relatedBlog', 'title')
      .populate('relatedUser', 'username')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotifications, markAsRead };