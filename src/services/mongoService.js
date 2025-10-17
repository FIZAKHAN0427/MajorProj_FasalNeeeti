import axios from 'axios';

/**
 * MongoDB Service for FasalNeeti
 * Handles all database operations for farmer data
 */

// MongoDB Atlas connection string (replace with your actual connection string)
const MONGODB_URI = process.env.REACT_APP_MONGODB_URI || 'mongodb://localhost:27017/fasalneeti';

// API base URL (for backend server)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class MongoService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('farmerData');
          window.location.href = '/farmer-login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new farmer
   * @param {Object} farmerData - Farmer registration data
   * @returns {Promise<Object>} - Registration response
   */
  async registerFarmer(farmerData) {
    try {
      const response = await this.apiClient.post('/farmers/register', farmerData);
      return {
        success: true,
        data: response.data,
        message: 'Farmer registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        message: 'Failed to register farmer'
      };
    }
  }

  /**
   * Login farmer
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} - Login response
   */
  async loginFarmer(credentials) {
    try {
      const response = await this.apiClient.post('/farmers/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('farmerData', JSON.stringify(response.data.farmer));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        message: 'Invalid credentials'
      };
    }
  }

  /**
   * Get farmer profile
   * @param {string} farmerId - Farmer ID
   * @returns {Promise<Object>} - Farmer profile data
   */
  async getFarmerProfile(farmerId) {
    try {
      const response = await this.apiClient.get(`/farmers/${farmerId}`);
      return {
        success: true,
        data: response.data,
        message: 'Profile fetched successfully'
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
        message: 'Could not load farmer profile'
      };
    }
  }

  /**
   * Update farmer profile
   * @param {string} farmerId - Farmer ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Update response
   */
  async updateFarmerProfile(farmerId, updateData) {
    try {
      const response = await this.apiClient.put(`/farmers/${farmerId}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed',
        message: 'Failed to update profile'
      };
    }
  }

  /**
   * Get farmer dashboard data
   * @param {string} farmerId - Farmer ID
   * @returns {Promise<Object>} - Dashboard data
   */
  async getFarmerDashboard(farmerId) {
    try {
      const response = await this.apiClient.get(`/farmers/${farmerId}/dashboard`);
      return {
        success: true,
        data: response.data,
        message: 'Dashboard data fetched successfully'
      };
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
        message: 'Could not load dashboard'
      };
    }
  }

  /**
   * Save crop data
   * @param {string} farmerId - Farmer ID
   * @param {Object} cropData - Crop information
   * @returns {Promise<Object>} - Save response
   */
  async saveCropData(farmerId, cropData) {
    try {
      const response = await this.apiClient.post(`/farmers/${farmerId}/crops`, cropData);
      return {
        success: true,
        data: response.data,
        message: 'Crop data saved successfully'
      };
    } catch (error) {
      console.error('Crop data save error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save crop data',
        message: 'Could not save crop information'
      };
    }
  }

  /**
   * Get weather data for farmer location
   * @param {string} farmerId - Farmer ID
   * @returns {Promise<Object>} - Weather data
   */
  async getWeatherData(farmerId) {
    try {
      const response = await this.apiClient.get(`/farmers/${farmerId}/weather`);
      return {
        success: true,
        data: response.data,
        message: 'Weather data fetched successfully'
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch weather data',
        message: 'Could not load weather information'
      };
    }
  }

  /**
   * Get yield predictions
   * @param {string} farmerId - Farmer ID
   * @returns {Promise<Object>} - Yield prediction data
   */
  async getYieldPredictions(farmerId) {
    try {
      const response = await this.apiClient.get(`/farmers/${farmerId}/predictions`);
      return {
        success: true,
        data: response.data,
        message: 'Predictions fetched successfully'
      };
    } catch (error) {
      console.error('Predictions fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch predictions',
        message: 'Could not load yield predictions'
      };
    }
  }

  /**
   * Get all farmers (admin only)
   * @returns {Promise<Object>} - List of farmers
   */
  async getAllFarmers() {
    try {
      const response = await this.apiClient.get('/admin/farmers');
      return {
        success: true,
        data: response.data,
        message: 'Farmers list fetched successfully'
      };
    } catch (error) {
      console.error('Farmers fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch farmers',
        message: 'Could not load farmers list'
      };
    }
  }

  /**
   * Delete farmer (admin only)
   * @param {string} farmerId - Farmer ID to delete
   * @returns {Promise<Object>} - Delete response
   */
  async deleteFarmer(farmerId) {
    try {
      const response = await this.apiClient.delete(`/admin/farmers/${farmerId}`);
      return {
        success: true,
        data: response.data,
        message: 'Farmer deleted successfully'
      };
    } catch (error) {
      console.error('Farmer delete error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete farmer',
        message: 'Could not delete farmer'
      };
    }
  }

  /**
   * Fallback to localStorage when API is not available
   */
  getFallbackData() {
    return {
      farmerData: JSON.parse(localStorage.getItem('farmerData') || '{}'),
      isOffline: true
    };
  }

  /**
   * Check if API is available
   * @returns {Promise<boolean>} - API availability status
   */
  async checkApiHealth() {
    try {
      await this.apiClient.get('/health');
      return true;
    } catch (error) {
      console.warn('API not available, using fallback data');
      return false;
    }
  }
}

// Export singleton instance
export default new MongoService();
