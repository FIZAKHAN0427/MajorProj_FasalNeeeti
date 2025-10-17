# API Keys Setup Guide for FasalNeeti

## 🌦️ OpenWeatherMap API (Priority 1)

### Steps:
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Verify email and login
4. Go to "API Keys" section
5. Copy your API key
6. Add to `backend/.env`:
   ```
   OPENWEATHER_API_KEY=your_actual_key_here
   ```

### Benefits:
- Real weather data for all districts
- 5-day accurate forecasts
- Weather alerts and warnings
- Historical weather data

---

## 🗺️ Mapbox API (Priority 2)

### Steps:
1. Go to https://www.mapbox.com/
2. Sign up for free account
3. Go to "Access Tokens" in dashboard
4. Copy default public token
5. Add to `backend/.env`:
   ```
   MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

### Benefits:
- High-quality satellite imagery
- Better district boundaries
- Offline map capabilities
- Custom styling options

---

## 🛰️ Google Earth Engine (Optional)

### Steps:
1. Go to https://earthengine.google.com/
2. Sign up (requires Google account)
3. Apply for access (usually approved quickly)
4. Get service account credentials
5. Add to `backend/.env`:
   ```
   GOOGLE_EARTH_ENGINE_KEY=path_to_service_account.json
   ```

### Benefits:
- Real NDVI data from satellites
- Crop health monitoring
- Historical satellite imagery
- Advanced agricultural analytics

---



## 💰 Market Data APIs (Optional)

### AgMarkNet (Government API)
- Free access to Indian market prices
- Real-time commodity pricing
- Historical price trends

### Steps:
1. Register at https://agmarknet.gov.in/
2. Apply for API access
3. Get API credentials

---

## 🔧 Quick Setup Commands

```bash
# 1. Copy environment template
cp backend/.env.example backend/.env

# 2. Edit with your API keys
notepad backend/.env

# 3. Restart backend server
cd backend
npm start
```

## ✅ Testing Your APIs

After adding keys, test them:

```bash
# Test weather API
curl "http://localhost:5001/api/debug-weather/Lucknow"

# Check if real data is being used
# Look for "Real weather data fetched" in backend logs
```

## 💡 Cost Estimates

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| OpenWeatherMap | 1,000 calls/day | $40/month for 100K calls |
| Mapbox | 50K map loads/month | $5/1K additional loads |
| Google Earth Engine | Free for research | Contact for commercial |

## 🚨 Important Notes

1. **Start with OpenWeatherMap** - Biggest immediate impact
2. **Keep API keys secure** - Never commit to GitHub
3. **Monitor usage** - Set up billing alerts
4. **Test thoroughly** - Verify data quality before production
5. **Have fallbacks** - App works without APIs (mock data)

## 🔒 Security Best Practices

```bash
# Add to .gitignore
echo "backend/.env" >> .gitignore

# Use environment variables in production
# Never hardcode API keys in source code
```