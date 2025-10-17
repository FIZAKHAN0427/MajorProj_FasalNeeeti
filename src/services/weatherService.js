const API_BASE_URL = 'http://localhost:5001/api';

class WeatherService {
  async getWeatherData(district) {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/${district}`);
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Weather service error:', error);
      return {
        success: false,
        error: error.message,
        data: {
          current: {
            temp_avg: 26,
            humidity: 65,
            rainfall_mm: 12.5,
            wind_speed: 8.2,
            description: 'partly cloudy'
          },
          forecast: [
            { day: 'Today', temp: 28, condition: 'Sunny', icon: '☀️' },
            { day: 'Tomorrow', temp: 26, condition: 'Partly Cloudy', icon: '🌤️' },
            { day: 'Day 3', temp: 24, condition: 'Rainy', icon: '🌧️' },
            { day: 'Day 4', temp: 25, condition: 'Cloudy', icon: '☁️' },
            { day: 'Day 5', temp: 29, condition: 'Sunny', icon: '☀️' }
          ]
        }
      };
    }
  }
}

export default new WeatherService();