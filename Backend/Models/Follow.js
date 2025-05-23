const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { indexes: [{ key: { follower: 1, followed: 1 }, unique: true }] });

module.exports = mongoose.model('Follow', followSchema);