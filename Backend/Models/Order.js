const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);