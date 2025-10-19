import authService from './authService';

const API_BASE_URL = 'http://localhost:5001/api';

class YieldPredictionService {
  async predictYield(data) {
    try {
      // Validate required fields
      const { state, district, crop, season, year, area } = data;
      if (!state || !district || !crop || !season || !year || !area) {
        throw new Error('Missing required fields: State, District, Crop, Season, Year, Area');
      }

      console.log('Making prediction request with data:', data);
      
      const response = await fetch(`${API_BASE_URL}/predict-yield`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Prediction result:', result);
      
      return result;
    } catch (error) {
      console.error('Yield prediction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getDistricts() {
    try {
      const response = await fetch(`${API_BASE_URL}/districts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Districts fetch error:', error);
      // Return empty array instead of dummy data
      return {
        success: false,
        data: []
      };
    }
  }

  async getModelInfo() {
    return {
      algorithm: 'Random Forest',
      accuracy: '91.5%',
      r2_score: 0.915,
      mae: 14.83,
      training_data: '345,336 records from APY dataset',
      features: ['State', 'District', 'Crop', 'Season', 'Year', 'Area']
    };
  }
}

export default new YieldPredictionService();