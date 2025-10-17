const API_BASE_URL = 'http://localhost:5001/api';

class AdminService {
  async getAllFarmers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/farmers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch farmers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Admin service error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getAllPredictions() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/predictions`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Admin service error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async generateAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate alerts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Alert generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateFarmer(farmerId, farmerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/farmers/${farmerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmerData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update farmer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Farmer update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFarmer(farmerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/farmers/${farmerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete farmer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Farmer deletion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new AdminService();