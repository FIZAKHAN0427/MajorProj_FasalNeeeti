const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  crop: { type: String, required: true },
  season: { type: String, required: true },
  year: { type: Number, required: true },
  area: { type: Number, required: true },
  landCoordinates: {
    type: [[Number]],
    default: []
  },
  variety: { type: String },
  plantingDate: { type: Date },
  expectedHarvest: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', cropSchema);