const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['weather', 'pest', 'disease', 'irrigation'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  district: String,
  isRead: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

module.exports = mongoose.model('Alert', alertSchema);