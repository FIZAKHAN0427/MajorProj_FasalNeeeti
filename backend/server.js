require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('./models/User');
const Prediction = require('./models/Prediction');
const Alert = require('./models/Alert');
const Crop = require('./models/Crop');
const YieldHistory = require('./models/YieldHistory');
const { auth, adminAuth, JWT_SECRET } = require('./middleware/auth');
const yieldModel = require('./ml/yieldModel');
const realDataService = require('./services/realDataService');

const app = express();
const PORT = process.env.PORT || 5001;

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fasalneeti';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Using fallback mode - some features may not work');
  });

// Check MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// OpenWeather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize ML model
yieldModel.loadModel();

// District coordinates for weather API
const districtCoords = {
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Kanpur': { lat: 26.4499, lon: 80.3319 },
  'Agra': { lat: 27.1767, lon: 78.0081 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Allahabad': { lat: 25.4358, lon: 81.8463 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 }
};

// Mock satellite and soil data
const districtData = {
  'Lucknow': { ndvi_mean: 0.68, soil_ph: 7.1 },
  'Kanpur': { ndvi_mean: 0.65, soil_ph: 6.8 },
  'Agra': { ndvi_mean: 0.62, soil_ph: 7.3 },
  'Varanasi': { ndvi_mean: 0.70, soil_ph: 6.9 },
  'Allahabad': { ndvi_mean: 0.67, soil_ph: 7.0 }
};

// City-specific weather data (realistic for Indian cities)
const cityWeatherData = {
  'Mumbai': { temp: 28, humidity: 78, rainfall: 15, wind: 12, desc: 'humid' },
  'Delhi': { temp: 25, humidity: 45, rainfall: 2, wind: 8, desc: 'clear' },
  'Bangalore': { temp: 22, humidity: 65, rainfall: 8, wind: 6, desc: 'pleasant' },
  'Chennai': { temp: 30, humidity: 82, rainfall: 12, wind: 10, desc: 'hot humid' },
  'Kolkata': { temp: 27, humidity: 75, rainfall: 18, wind: 7, desc: 'humid' },
  'Pune': { temp: 24, humidity: 60, rainfall: 5, wind: 9, desc: 'pleasant' },
  'Hyderabad': { temp: 26, humidity: 55, rainfall: 3, wind: 8, desc: 'warm' },
  'Lucknow': { temp: 23, humidity: 68, rainfall: 8, wind: 6, desc: 'moderate' },
  'Kanpur': { temp: 24, humidity: 65, rainfall: 6, wind: 7, desc: 'moderate' },
  'Agra': { temp: 25, humidity: 62, rainfall: 4, wind: 8, desc: 'dry' }
};

// Get weather data from OpenWeather API
async function getWeatherData(district) {
  // Try real API first (only if valid API key)
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'demo_key') {
    try {
      let response;
      const coords = districtCoords[district];
      
      if (coords) {
        response = await axios.get(
          `${WEATHER_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
      } else {
        response = await axios.get(
          `${WEATHER_BASE_URL}/weather?q=${district},IN&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
      }
      
      console.log(`✅ Real weather data fetched for ${district}`);
      return {
        temp_avg: Math.round(response.data.main.temp * 100) / 100,
        humidity: response.data.main.humidity,
        rainfall_mm: response.data.rain ? response.data.rain['1h'] || 0 : 0,
        wind_speed: Math.round(response.data.wind.speed * 3.6 * 100) / 100, // Convert m/s to km/h
        description: response.data.weather[0].description
      };
    } catch (error) {
      console.log(`❌ Weather API failed for ${district}: ${error.message}`);
    }
  } else {
    console.log('⚠️ No valid OpenWeather API key found');
  }
  
  // Use realistic city-specific data
  const cityData = cityWeatherData[district];
  if (cityData) {
    return {
      temp_avg: cityData.temp + (Math.random() - 0.5) * 4, // ±2°C variation
      humidity: cityData.humidity + (Math.random() - 0.5) * 10,
      rainfall_mm: cityData.rainfall + Math.random() * 5,
      wind_speed: cityData.wind + (Math.random() - 0.5) * 4,
      description: cityData.desc
    };
  }
  
  // Generic fallback
  return {
    temp_avg: 26 + Math.random() * 6,
    humidity: 60 + Math.random() * 20,
    rainfall_mm: Math.random() * 10,
    wind_speed: 5 + Math.random() * 10,
    description: 'partly cloudy'
  };
}

// Enhanced ML model with real data
async function predictYield(crop, season, district, year, userId = null, area = null) {
  // Try to get real data first, fallback to mock
  let staticData;
  try {
    staticData = await realDataService.getEnhancedDistrictData(district);
    if (!staticData) {
      staticData = districtData[district] || districtData['Lucknow'];
    }
  } catch (error) {
    console.warn('Real data API failed, using mock data:', error.message);
    staticData = districtData[district] || districtData['Lucknow'];
  }
  
  const weatherData = await getWeatherData(district);
  
  const mlResult = await yieldModel.predict(
    crop, season, district,
    staticData.ndvi_mean,
    weatherData.temp_avg,
    weatherData.humidity,
    staticData.soil_ph
  );
  
  const predictionData = {
    predicted_yield: mlResult.predictedYield,
    confidence: mlResult.confidence,
    model_used: mlResult.modelUsed,
    factors: {
      ndvi_mean: staticData.ndvi_mean,
      temp_avg: weatherData.temp_avg,
      humidity: weatherData.humidity,
      soil_ph: staticData.soil_ph
    },
    weather: weatherData
  };
  
  if (userId) {
    try {
      const prediction = new Prediction({
        userId,
        crop,
        season,
        district,
        year,
        area: area || null,
        predictedYield: mlResult.predictedYield,
        confidence: mlResult.confidence,
        factors: predictionData.factors
      });
      await prediction.save();
    } catch (error) {
      console.error('Failed to save prediction:', error);
    }
  }
  
  return predictionData;
}

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'farmer', ...otherData } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email, password, role, ...otherData });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Crop yield prediction endpoint
app.post('/api/predict-yield', async (req, res) => {
  try {
    const { state, district, crop, season, year, area } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }
    
    if (!state || !district || !crop || !season || !year || !area) {
      return res.status(400).json({ error: 'Missing required fields: State, District, Crop, Season, Year, Area' });
    }
    
    const prediction = await predictYield(crop, season, district, year, userId);
    
    // Calculate total production based on area
    const totalProduction = prediction.predicted_yield * parseFloat(area);
    
    res.json({
      success: true,
      data: {
        ...prediction,
        state,
        district,
        crop,
        season,
        year,
        area: parseFloat(area),
        total_production: Math.round(totalProduction)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Get available districts
app.get('/api/districts', (req, res) => {
  res.json({
    success: true,
    data: Object.keys(districtData)
  });
});

// Get weather data for a district
app.get('/api/weather/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const weatherData = await getWeatherData(district);
    
    // Get 5-day forecast if using real API
    let forecast = [];
    if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'demo_key') {
      try {
        const coords = districtCoords[district];
        let forecastResponse;
        
        if (coords) {
          forecastResponse = await axios.get(
            `${WEATHER_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
        } else {
          forecastResponse = await axios.get(
            `${WEATHER_BASE_URL}/forecast?q=${district},IN&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
        }
        
        // Process 5-day forecast (every 8th item = daily)
        const dailyForecasts = forecastResponse.data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
        forecast = dailyForecasts.map((item, index) => ({
          day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].description,
          icon: getWeatherIcon(item.weather[0].main)
        }));
        
        console.log(`✅ Real forecast data fetched for ${district}`);
      } catch (error) {
        console.log(`❌ Forecast API failed: ${error.message}`);
      }
    }
    
    // Fallback forecast if API failed
    if (forecast.length === 0) {
      forecast = [
        { day: 'Today', temp: Math.round(weatherData.temp_avg), condition: weatherData.description, icon: '☀️' },
        { day: 'Tomorrow', temp: Math.round(weatherData.temp_avg - 2), condition: 'Partly Cloudy', icon: '🌤️' },
        { day: 'Day 3', temp: Math.round(weatherData.temp_avg - 4), condition: 'Rainy', icon: '🌧️' },
        { day: 'Day 4', temp: Math.round(weatherData.temp_avg - 1), condition: 'Cloudy', icon: '☁️' },
        { day: 'Day 5', temp: Math.round(weatherData.temp_avg + 1), condition: 'Sunny', icon: '☀️' }
      ];
    }
    
    res.json({
      success: true,
      data: {
        current: weatherData,
        forecast,
        source: OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'demo_key' ? 'OpenWeather API' : 'Mock Data'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather data fetch failed' });
  }
});

// Helper function to get weather icons
function getWeatherIcon(weatherMain) {
  const iconMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return iconMap[weatherMain] || '🌤️';
}

// Protected farmer dashboard
app.get('/api/farmer/dashboard', auth, async (req, res) => {
  try {
    const user = req.user;
    const district = user.location?.split(',')[1]?.trim() || 'Lucknow';
    const weatherData = await getWeatherData(district);
    const recentPredictions = await Prediction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
    const alerts = await Alert.find({ userId: user._id, isActive: true }).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      data: {
        user,
        weather: weatherData,
        recentPredictions,
        alerts
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
});

// Admin endpoints
app.get('/api/admin/farmers', adminAuth, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json({ success: true, data: farmers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

app.get('/api/admin/predictions', adminAuth, async (req, res) => {
  try {
    const predictions = await Prediction.find().populate('userId', 'name email location');
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Generate alerts based on weather conditions
app.post('/api/alerts/generate', adminAuth, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' });
    const alerts = [];
    
    for (const farmer of farmers) {
      const district = farmer.location?.split(',')[1]?.trim() || 'Lucknow';
      const weather = await getWeatherData(district);
      
      if (weather.temp_avg > 35) {
        const alert = new Alert({
          userId: farmer._id,
          type: 'weather',
          severity: 'high',
          title: 'High Temperature Alert',
          message: 'Temperature exceeds 35°C - consider irrigation and shade protection',
          district
        });
        await alert.save();
        alerts.push(alert);
      }
      
      if (weather.humidity < 30) {
        const alert = new Alert({
          userId: farmer._id,
          type: 'weather',
          severity: 'medium',
          title: 'Low Humidity Warning',
          message: 'Low humidity detected - drought risk, monitor soil moisture',
          district
        });
        await alert.save();
        alerts.push(alert);
      }
    }
    
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ error: 'Alert generation failed' });
  }
});

// Update farmer endpoint
app.put('/api/admin/farmers/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const farmer = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update farmer' });
  }
});

// Delete farmer endpoint
app.delete('/api/admin/farmers/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const farmer = await User.findByIdAndDelete(id);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    // Also delete related predictions and alerts
    await Prediction.deleteMany({ userId: id });
    await Alert.deleteMany({ userId: id });
    
    res.json({ success: true, message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete farmer' });
  }
});

// Get farmer profile endpoint
app.get('/api/farmer/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update farmer profile endpoint
app.put('/api/farmer/profile', auth, async (req, res) => {
  try {
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Test crop endpoint (no auth)
app.post('/api/test-crop', async (req, res) => {
  try {
    console.log('Test crop data:', req.body);
    res.json({ success: true, message: 'Test crop endpoint working', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crop management endpoints
app.get('/api/farmer/crops', auth, async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] }); // Return empty array if DB not connected
    }
    
    console.log('Fetching crops for user:', req.user._id);
    const crops = await Crop.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    console.log('Found crops:', crops.length);
    res.json({ success: true, data: crops });
  } catch (error) {
    console.error('Fetch crops error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch crops' });
  }
});

app.post('/api/farmer/crops', auth, async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        error: 'Database not connected', 
        details: 'MongoDB connection is not ready' 
      });
    }
    
    console.log('Creating crop for user:', req.user._id);
    console.log('Crop data:', req.body);
    console.log('Land coordinates:', req.body.landCoordinates);
    
    const cropData = { ...req.body, farmerId: req.user._id };
    const crop = new Crop(cropData);
    const savedCrop = await crop.save();
    
    console.log('Crop saved successfully:', savedCrop._id);
    console.log('Saved coordinates:', savedCrop.landCoordinates);
    res.status(201).json({ success: true, data: savedCrop });
  } catch (error) {
    console.error('Crop creation error:', error);
    res.status(500).json({ success: false, error: 'Failed to add crop', details: error.message });
  }
});

app.delete('/api/farmer/crops/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete crop' });
  }
});

// Real data testing endpoint
app.get('/api/test-real-data/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const realData = await realDataService.getEnhancedDistrictData(district);
    const mockData = districtData[district];
    
    res.json({
      success: true,
      district,
      real_data: realData,
      mock_data: mockData,
      recommendation: realData ? 'Using real APIs' : 'Using mock data'
    });
  } catch (error) {
    res.status(500).json({ error: 'Real data test failed' });
  }
});

// Debug weather endpoint
app.get('/api/debug-weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await getWeatherData(city);
    res.json({
      success: true,
      city,
      weather,
      has_coordinates: !!districtCoords[city],
      api_key_status: OPENWEATHER_API_KEY === 'demo_key' ? 'demo' : 'real'
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather debug failed' });
  }
});

// Debug coordinates endpoint
app.get('/api/debug-coordinates/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const crops = await Crop.find({ farmerId }).select('crop district landCoordinates');
    res.json({
      success: true,
      farmerId,
      crops: crops.map(crop => ({
        crop: crop.crop,
        district: crop.district,
        hasCoordinates: crop.landCoordinates && crop.landCoordinates.length > 0,
        coordinateCount: crop.landCoordinates ? crop.landCoordinates.length : 0,
        coordinates: crop.landCoordinates
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Coordinates debug failed' });
  }
});

// Yield history endpoints
app.post('/api/farmer/yield-history', auth, async (req, res) => {
  try {
    const yieldData = { ...req.body, farmerId: req.user._id };
    const yieldHistory = new YieldHistory(yieldData);
    const saved = await yieldHistory.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save yield history' });
  }
});

app.get('/api/farmer/yield-history', auth, async (req, res) => {
  try {
    const history = await YieldHistory.find({ farmerId: req.user._id })
      .populate('cropId', 'crop season district')
      .sort({ year: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch yield history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/predict-yield');
  console.log('- GET /api/districts');
  console.log('- GET /api/weather/:district');
  console.log('- GET /api/farmer/dashboard (protected)');
  console.log('- GET /api/farmer/profile (protected)');
  console.log('- PUT /api/farmer/profile (protected)');
  console.log('- GET /api/admin/farmers (admin only)');
  console.log('- PUT /api/admin/farmers/:id (admin only)');
  console.log('- DELETE /api/admin/farmers/:id (admin only)');
  console.log('- GET /api/admin/predictions (admin only)');
  console.log('- POST /api/alerts/generate (admin only)');
  console.log('- POST /api/farmer/yield-history (protected)');
  console.log('- GET /api/farmer/yield-history (protected)');
});