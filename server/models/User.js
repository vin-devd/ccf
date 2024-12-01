const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  ip: String
});

module.exports = mongoose.model('User', userSchema);
