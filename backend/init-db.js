const mongoose = require('mongoose');
const User = require('./models/User');
const Crop = require('./models/Crop');
const Prediction = require('./models/Prediction');
const Alert = require('./models/Alert');

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/fasalneeti';

async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create collections if they don't exist
    await User.createCollection();
    console.log('✅ Users collection created/verified');

    await Crop.createCollection();
    console.log('✅ Crops collection created/verified');

    await Prediction.createCollection();
    console.log('✅ Predictions collection created/verified');

    await Alert.createCollection();
    console.log('✅ Alerts collection created/verified');

    // Create indexes for better performance
    await Crop.createIndexes();
    await User.createIndexes();
    
    console.log('✅ Database initialization complete');
    console.log('📊 Collections created:');
    console.log('   - users');
    console.log('   - crops');
    console.log('   - predictions');
    console.log('   - alerts');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();