# OpenWeather API Setup Instructions

## Step 1: Get Your API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Copy your API key

## Step 2: Configure the Backend

1. Open `backend/.env` file
2. Replace `your_openweather_api_key_here` with your actual API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   PORT=5000
   ```

## Step 3: Test the Integration

1. Start the backend server: `npm start` (in backend folder)
2. Test weather endpoint: `http://localhost:5000/api/weather/Lucknow`
3. You should see real weather data

## Fallback Behavior

If no API key is provided, the system will use mock weather data to ensure the application continues to work.

## Supported Districts

- Lucknow
- Kanpur  
- Agra
- Varanasi
- Allahabad

You can add more districts by updating the `districtCoords` object in `backend/server.js`.