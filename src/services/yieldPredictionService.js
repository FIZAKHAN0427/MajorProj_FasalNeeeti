import authService from './authService';

const API_BASE_URL = 'http://localhost:5001/api';

class YieldPredictionService {
  async predictYield(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict-yield`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Prediction failed');
      }
      
      return await response.json();
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
      return {
        success: false,
        data: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad']
      };
    }
  }
}

export default new YieldPredictionService();