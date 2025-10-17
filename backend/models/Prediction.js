const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String },
  district: { type: String, required: true },
  crop: { type: String, required: true },
  season: { type: String, required: true },
  year: { type: Number, required: true },
  area: { type: Number },
  predictedYield: { type: Number, required: true },
  confidence: { type: Number, required: true },
  factors: {
    ndvi_mean: Number,
    temp_avg: Number,
    humidity: Number,
    soil_ph: Number,
    rainfall_mm: Number
  },
  actualYield: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);