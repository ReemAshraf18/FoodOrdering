const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['Like', 'Comment', 'Order'], required: true },
  message: { type: String, required: true },
  relatedBlog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Notification', notificationSchema);