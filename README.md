# FasalNeeti - Smart Farming Solutions

**Slogan:** "FasalNeeti: Apni Mitti, Apna Data, Apna Bhavishya"

A React.js frontend application designed for Indian farmers, providing AI-powered agricultural insights, crop yield predictions, and stress detection alerts.

## 🌾 Features

### For Farmers
- **AI Crop Yield Prediction**: Predict yield (kg/ha) using satellite NDVI, weather, and soil data with just 4 inputs: District, Crop, Season, Year
- **Stress Detection Alerts**: Real-time monitoring for drought, heat stress, and pest detection
- **Interactive Dashboard**: Comprehensive analytics with charts and weather data
- **Fertilizer Recommendations**: AI-powered advice for optimal fertilizer usage
- **Weather Integration**: 5-day weather forecast and current conditions

### For Admins
- **Farmer Management**: View, edit, and manage registered farmers
- **Regional Analytics**: Aggregated yield trends and stress alerts by region
- **Downloadable Reports**: Export data for analysis and reporting
- **System Monitoring**: Real-time statistics and performance metrics

## 🎨 Design Features

- **Warm Earthy Colors**: Indian-inspired color palette with earth, crop, and soil tones
- **Light/Dark Theme**: Toggle between light and dark modes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Hindi-English Support**: Bilingual interface for better accessibility
- **Crop Icons & Motifs**: Subtle desi design elements throughout

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   git clone https://github.com/FIZAKHAN0427/MajorProj_FasalNeeeti.git
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Setup OpenWeather API (Optional but recommended):**
   - Get free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Edit `backend/.env` and add your API key:
     ```
     OPENWEATHER_API_KEY=your_actual_api_key_here
     ```
   - See `setup-openweather.md` for detailed instructions

5. **Start both servers:**
   ```bash
   # Option 1: Use the automated script
   start-full-app.bat
   
   # Option 2: Manual start (two terminals)
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend  
   npm start
   ```

6. **Open your browser and visit:**
   ```
   Frontend: http://localhost:3000
   Backend API: http://localhost:5001
   ```

## 📱 Usage

### Farmer Registration & Login
1. Click "Farmer Login" on the homepage
2. Fill in your farming details:
   - Personal information (name, location, mobile)
   - Farming information (soil type, last crop, irrigation type)
   - Optional: Upload sensor data or crop images
3. Access your personalized dashboard with:
   - Yield prediction charts
   - Stress detection alerts
   - Weather forecasts
   - Fertilizer recommendations

### Admin Access
1. Click "Admin Login" on the homepage
2. Use demo credentials:
   - **Username:** admin
   - **Password:** admin123
3. Access admin dashboard with:
   - Farmer management tools
   - Regional analytics
   - Report generation
   - System statistics

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js 18
- **Styling:** Tailwind CSS
- **Charts:** Recharts library
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Icons & Fonts:** Google Fonts (Pacifico, Inter)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ML Model:** Simulated XGBoost/Random Forest predictions
- **Data Sources:** Satellite NDVI, Weather APIs, Soil databases
- **API:** RESTful endpoints for yield prediction

## 📊 Mock Data

The application uses comprehensive mock data including:
- Sample farmer profiles from different Indian states
- Yield prediction data with monthly trends
- Weather information and forecasts
- Stress detection analytics
- Regional farming statistics
- Fertilizer recommendations

## 🎯 Key Components

### Pages
- **Homepage**: Hero section, features, call-to-action
- **Farmer Login**: Registration form with validation
- **Farmer Dashboard**: Charts, weather, recommendations
- **Admin Login**: Simple authentication
- **Admin Dashboard**: Management and analytics
- **About**: Platform information and team details

### Components
- **Navbar**: Responsive navigation with theme toggle
- **ThemeContext**: Light/dark mode management
- **Charts**: Interactive data visualizations

## 🌟 Special Features

### Farmer-Friendly Design
- Large, clear buttons and text
- Intuitive navigation
- Hindi translations for key terms
- Visual icons for better understanding
- Empty states with helpful messages

### Data Visualization
- Line charts for yield predictions
- Pie charts for stress detection
- Bar charts for regional analytics
- Weather widgets with forecasts
- Interactive tooltips and legends

### Responsive Layout
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for various screen sizes

## 🤖 Crop Yield Prediction Model

### Model Features
- **Input:** District, Crop, Season, Year (only 4 user inputs)
- **Auto-fetched Data:** NDVI, Rainfall, Temperature, Soil pH
- **ML Algorithm:** XGBoost/Random Forest simulation
- **Output:** Predicted yield in kg/ha with 94% confidence
- **Evaluation:** R² Score, MAE, RMSE metrics

### Supported Crops
- Rice, Wheat, Maize, Sugarcane, Cotton

### Supported Districts
- Lucknow, Kanpur, Agra, Varanasi, Allahabad (expandable)

## 🔮 Future Enhancements

### Real Data Integration
- Google Earth Engine for satellite data
- NASA POWER API for weather data
- ISRO/ICAR soil databases
- UPAg dataset for historical yields

### Advanced ML Models
- TensorFlow/PyTorch implementation
- Multi-modal deep learning
- Time series forecasting
- Ensemble model predictions

## 📝 Development Notes

### Frontend Structure
- Clean, commented code for easy maintenance
- Modular component architecture
- Consistent naming conventions
- Reusable utility functions

### Backend Structure
- Express.js REST API
- Modular route handlers
- Mock ML model simulation
- CORS enabled for frontend integration

### Performance Optimizations
- Lazy loading for large components
- Optimized image handling
- Efficient state management
- Minimal bundle size
- Fast API response times

## 🤝 Contributing

This is a demo application showcasing modern React development practices for agricultural technology. The codebase is well-documented and structured for easy modification and extension.

## 📞 Support

For technical support or questions:
- **Email**: support@fasalneeti.com
- **Phone**: 1800-123-456 (Toll Free)
- **Admin Support**: admin@fasalneeti.com

---

**Built with ❤️ for Indian Farmers**

*Empowering agriculture through technology - "अपनी मिट्टी, अपना डेटा, अपना भविष्य"*
