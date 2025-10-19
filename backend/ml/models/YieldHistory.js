const mongoose = require('mongoose');

const yieldHistorySchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  year: { type: Number, required: true },
  actualYield: { type: Number, required: true }, // kg/ha
  predictedYield: { type: Number },
  harvestDate: { type: Date },
  notes: { type: String },
  weatherConditions: {
    avgTemp: Number,
    totalRainfall: Number,
    humidity: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('YieldHistory', yieldHistorySchema);