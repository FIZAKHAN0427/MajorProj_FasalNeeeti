# Real Data Integration Guide

## 1. SATELLITE DATA (NDVI) - Replace Mock districtData

### Google Earth Engine API
```javascript
// Replace: backend/server.js districtData
const ee = require('@google/earthengine');

async function getRealNDVI(district, startDate, endDate) {
  const coords = districtCoords[district];
  const point = ee.Geometry.Point([coords.lon, coords.lat]);
  
  const collection = ee.ImageCollection('MODIS/006/MOD13Q1')
    .filterDate(startDate, endDate)
    .filterBounds(point);
    
  const ndvi = collection.select('NDVI').mean();
  const value = await ndvi.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: point,
    scale: 250
  }).getInfo();
  
  return value.NDVI / 10000; // Scale factor
}
```

### NASA POWER API (Alternative)
```javascript
async function getNASANDVI(lat, lon) {
  const response = await axios.get(
    `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=NDVI&community=AG&longitude=${lon}&latitude=${lat}&start=20240101&end=20241231&format=JSON`
  );
  return response.data.properties.parameter.NDVI;
}
```

## 2. SOIL DATA - Replace Mock soil_ph

### ISRO Bhuvan API
```javascript
async function getRealSoilData(lat, lon) {
  const response = await axios.get(
    `https://bhuvan-app1.nrsc.gov.in/soil/soil.php?lat=${lat}&lon=${lon}`
  );
  return {
    soil_ph: response.data.ph,
    organic_carbon: response.data.oc,
    nitrogen: response.data.n,
    phosphorus: response.data.p,
    potassium: response.data.k
  };
}
```

### SoilGrids API (Global)
```javascript
async function getSoilGridsData(lat, lon) {
  const response = await axios.get(
    `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&depth=0-5cm&value=mean`
  );
  return response.data.properties.layers[0].depths[0].values.mean / 10;
}
```

## 3. WEATHER DATA - Already Semi-Real

### Current: OpenWeather API ✅
```bash
# Get real API key
OPENWEATHER_API_KEY=your_real_api_key_here
```

### Enhanced: Multiple Weather Sources
```javascript
// Add IMD (India Meteorological Department)
async function getIMDWeather(district) {
  const response = await axios.get(
    `https://api.imd.gov.in/weather/${district}`
  );
  return response.data;
}
```

## 4. CROP YIELD DATA - Replace Mock ML

### ICAR Database Integration
```javascript
async function getHistoricalYield(crop, district, year) {
  const response = await axios.get(
    `https://aps.dac.gov.in/APY/Public_Report1.aspx?crop=${crop}&district=${district}&year=${year}`
  );
  return response.data.yield_per_hectare;
}
```

### Real ML Model Training
```python
# Python script for real ML model
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Load real agricultural data
data = pd.read_csv('real_crop_data.csv')
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Export to Node.js compatible format
import joblib
joblib.dump(model, 'real_yield_model.pkl')
```

## 5. FARMER DATA - Replace mockFarmers

### Database Migration Script
```javascript
// Replace mockData with real farmer registrations
async function migrateToRealData() {
  // Clear mock data
  await User.deleteMany({ email: { $regex: /mock|demo|test/ } });
  
  // Import real farmer data from CSV/Excel
  const realFarmers = await csv().fromFile('real_farmers.csv');
  await User.insertMany(realFarmers);
}
```

## 6. MARKET PRICES - Add Real Data

### AGMARKNET API
```javascript
async function getMarketPrices(crop, market) {
  const response = await axios.get(
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&filters[commodity]=${crop}&filters[market]=${market}`
  );
  return response.data.records;
}
```

## 7. FERTILIZER RECOMMENDATIONS - Real Algorithms

### Nutrient Management API
```javascript
async function getRealFertilizerRec(soilData, cropType, targetYield) {
  const response = await axios.post('https://nutrient-api.icar.gov.in/recommend', {
    soil_ph: soilData.ph,
    organic_carbon: soilData.oc,
    crop: cropType,
    target_yield: targetYield
  });
  return response.data.recommendations;
}
```

## 8. PEST & DISEASE DATA

### NIPHM Database
```javascript
async function getPestAlerts(crop, location, season) {
  const response = await axios.get(
    `https://niphm.gov.in/api/pest-forecast?crop=${crop}&location=${location}&season=${season}`
  );
  return response.data.alerts;
}
```

## Implementation Priority:

### Phase 1 (Immediate):
1. ✅ OpenWeather API (already implemented)
2. 🔄 Real MongoDB connection
3. 🔄 Google Earth Engine for NDVI

### Phase 2 (Medium):
1. 🔄 SoilGrids API for soil data
2. 🔄 ICAR yield database
3. 🔄 Market price integration

### Phase 3 (Advanced):
1. 🔄 Real ML model training
2. 🔄 Pest/disease forecasting
3. 🔄 Satellite imagery analysis

## Environment Variables Needed:
```bash
# .env file
OPENWEATHER_API_KEY=your_key
GOOGLE_EARTH_ENGINE_KEY=your_key
MONGODB_URI=mongodb+srv://your_cluster
AGMARKNET_API_KEY=your_key
SOILGRIDS_API_KEY=your_key
```