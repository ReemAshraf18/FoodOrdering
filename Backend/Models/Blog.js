const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  body: { type: String, required: true },
  photos: [{ type: String }], // Array of URLs from Cloudinary
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tags: [{ type: String, index: true }],
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Blog', blogSchema);