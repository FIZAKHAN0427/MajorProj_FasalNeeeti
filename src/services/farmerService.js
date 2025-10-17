import authService from './authService';

const API_BASE_URL = 'http://localhost:5001/api';

class FarmerService {
  async getFarmerDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        throw new Error('Dashboard data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFarmerProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/profile`, {
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        throw new Error('Profile fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateFarmerProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error('Profile update failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  downloadFarmerData() {
    const user = authService.getUser();
    const data = {
      profile: user,
      downloadDate: new Date().toISOString(),
      dataType: 'farmer_profile'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasalneeti-farmer-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default new FarmerService();