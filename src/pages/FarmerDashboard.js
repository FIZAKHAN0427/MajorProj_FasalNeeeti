import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatNumber, formatInteger } from '../utils/formatNumber';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import mongoService from '../services/mongoService';
import authService from '../services/authService';
import farmerService from '../services/farmerService';
import dataToggleService from '../services/dataToggleService';
import weatherService from '../services/weatherService';
import YieldPrediction from '../components/YieldPrediction';
import CropManagement from '../components/CropManagement';
import WeatherAlerts from '../components/WeatherAlerts';
import SoilHealthMonitor from '../components/SoilHealthMonitor';

/**
 * Professional Farmer Dashboard with comprehensive farming insights
 * Features: Real-time data, predictions, recommendations, alerts
 */
const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [weatherData, setWeatherData] = useState({
    current: {
      temperature: 28,
      humidity: 65,
      rainfall: 12.5,
      windSpeed: 8.2,
      soilMoisture: 45
    },
    forecast: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLocation, setWeatherLocation] = useState('Lucknow');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showWeatherAlerts, setShowWeatherAlerts] = useState(true);
  const [showSoilHealth, setShowSoilHealth] = useState(false);
  
  // Mock data for demonstration
  const yieldPredictionData = [
    { month: 'Jan', predicted: 45, actual: 42, optimal: 50 },
    { month: 'Feb', predicted: 52, actual: 48, optimal: 55 },
    { month: 'Mar', predicted: 48, actual: 51, optimal: 52 },
    { month: 'Apr', predicted: 61, actual: 58, optimal: 65 },
    { month: 'May', predicted: 55, actual: 52, optimal: 60 },
    { month: 'Jun', predicted: 67, actual: 65, optimal: 70 }
  ];
  
  const stressDetectionData = [
    { name: 'Healthy', value: 65, color: '#22c55e' },
    { name: 'Drought Risk', value: 20, color: '#f59e0b' },
    { name: 'Heat Stress', value: 10, color: '#ef4444' },
    { name: 'Pest Risk', value: 5, color: '#8b5cf6' }
  ];
  

  
  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Low soil moisture detected - irrigation recommended',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: 'Weather forecast shows rain in next 3 days',
      timestamp: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      message: 'Crop growth is on track for this season',
      timestamp: '1 day ago',
      priority: 'low'
    }
  ];

  const fertilizerRecommendations = [
    {
      type: 'Nitrogen (N)',
      current: '45 kg/ha',
      recommended: '60 kg/ha',
      status: 'increase',
      advice: 'Increase nitrogen for better leaf growth and overall plant health.'
    },
    {
      type: 'Phosphorus (P)',
      current: '25 kg/ha',
      recommended: '20 kg/ha',
      status: 'decrease',
      advice: 'Reduce phosphorus application to prevent nutrient imbalance.'
    },
    {
      type: 'Potassium (K)',
      current: '30 kg/ha',
      recommended: '30 kg/ha',
      status: 'optimal',
      advice: 'Current potassium levels are optimal for your crop.'
    }
  ];

  // Load farmer data and dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      const user = authService.getUser();
      const token = authService.getToken();
      
      if (!user || !token || user.role !== 'farmer') {
        navigate('/farmer-login');
        return;
      }
      
      setFarmerData(user);
      
      try {
        // Get weather location from user's crops or default
        let district = 'Lucknow'; // Default
        try {
          const cropsResponse = await fetch(`http://localhost:5001/api/farmer/crops`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const cropsResult = await cropsResponse.json();
          if (cropsResult.success && cropsResult.data.length > 0) {
            district = cropsResult.data[0].district; // Use first crop's location
          }
        } catch (error) {
          console.warn('Could not fetch crops for weather location');
        }
        setWeatherLocation(district);
        
        const weatherResult = await weatherService.getWeatherData(district);
        
        if (weatherResult.success) {
          setWeatherData({
            current: {
              temperature: weatherResult.data.current.temp_avg,
              humidity: weatherResult.data.current.humidity,
              rainfall: weatherResult.data.current.rainfall_mm,
              windSpeed: weatherResult.data.current.wind_speed,
              soilMoisture: 45 // This would come from IoT sensors
            },
            forecast: weatherResult.data.forecast || [],
            source: weatherResult.data.source
          });
        }
        
        // Try to fetch dashboard data from MongoDB
        const result = await mongoService.getFarmerDashboard(user.id || 'demo');
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          console.warn('Using mock dashboard data');
        }
      } catch (error) {
        console.warn('Dashboard API unavailable, using mock data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setEditFormData({
      name: farmerData.name,
      email: farmerData.email,
      mobile: farmerData.mobile,
      state: farmerData.state,
      district: farmerData.district,
      crop: farmerData.crop,
      season: farmerData.season,
      area: farmerData.area,
      farmSize: farmerData.farmSize,
      soilType: farmerData.soilType,
      lastCrop: farmerData.lastCrop
    });
    setShowEditProfile(true);
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    // Update local state immediately
    const updatedData = { ...farmerData, ...editFormData };
    setFarmerData(updatedData);
    authService.updateUser(updatedData);
    
    // If location changed, update weather data
    if (editFormData.location && editFormData.location !== farmerData.location) {
      let district = 'Lucknow'; // Default
      const locationParts = editFormData.location.split(',');
      if (locationParts.length >= 2) {
        district = locationParts[1].trim(); // "State, District"
      } else {
        district = locationParts[0].trim(); // Just "District"
      }
      setWeatherLocation(district);
      
      try {
        const weatherResult = await weatherService.getWeatherData(district);
        if (weatherResult.success) {
          setWeatherData({
            current: {
              temperature: weatherResult.data.current.temp_avg,
              humidity: weatherResult.data.current.humidity,
              rainfall: weatherResult.data.current.rainfall_mm,
              windSpeed: weatherResult.data.current.wind_speed,
              soilMoisture: 45
            },
            forecast: weatherResult.data.forecast || [],
            source: weatherResult.data.source
          });
        }
      } catch (error) {
        console.warn('Weather update failed:', error);
      }
    }
    
    alert('Profile updated successfully!');
    setShowEditProfile(false);
  };

  if (isLoading || !farmerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard tabs configuration
  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'yield-prediction', name: 'My Crops' },
    { id: 'predictions', name: 'Analytics' },
    { id: 'weather', name: 'Weather' },
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'profile', name: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
      
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-secondary-800 shadow-lg border-b border-primary-100 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
                    Welcome, {farmerData.name}
                  </h1>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {farmerData.location} • {farmerData.farmSize || 'Farm'} • {farmerData.lastCrop || 'Crop'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  dataToggleService.isUsingRealData() ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-secondary-600 dark:text-secondary-400">
                  {dataToggleService.isUsingRealData() ? 'Real Data' : 'Demo Data'}
                </span>
                <button
                  onClick={() => dataToggleService.toggleDataSource()}
                  className="text-xs text-primary-600 hover:text-primary-700 underline"
                >
                  Switch
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-secondary-800 border-b border-primary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="stat-card animate-fade-in">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-primary-600 mb-2">{formatNumber(68)}%</div>
                  <div className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">Predicted Yield</div>
                </div>
              </div>
              <div className="stat-card animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-accent-600 mb-2">{formatNumber(weatherData.current.soilMoisture)}%</div>
                  <div className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">Soil Moisture</div>
                </div>
              </div>
              <div className="stat-card animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-yellow-600 mb-2">{formatNumber(weatherData.current.temperature)}°C</div>
                  <div className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">Temperature</div>
                </div>
              </div>
              <div className="stat-card animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-red-600 mb-2">{recentAlerts.filter(a => a.priority === 'high').length}</div>
                  <div className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">Active Alerts</div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="dashboard-card">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l6.586 6.586a2 2 0 002.828 0l6.586-6.586A2 2 0 0019.414 5H4.586A2 2 0 003.172 7z" />
                  </svg>
                </div>
                Recent Alerts & Notifications
              </h2>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                      alert.type === 'warning'
                        ? 'alert-warning'
                        : alert.type === 'success'
                        ? 'alert-success'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          alert.type === 'warning' ? 'bg-yellow-200 dark:bg-yellow-800' :
                          alert.type === 'success' ? 'bg-green-200 dark:bg-green-800' :
                          'bg-blue-200 dark:bg-blue-800'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {alert.type === 'warning' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />}
                            {alert.type === 'success' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                            {alert.type === 'info' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">
                            {alert.message}
                          </p>
                          <p className="text-sm opacity-75">
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-primary-200 dark:border-secondary-700">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="btn-outline text-sm py-2 px-4 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <span>Update Crop Data</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('predictions')}
                    className="btn-outline text-sm py-2 px-4 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>View Reports</span>
                  </button>
                  <button 
                    onClick={() => window.open('mailto:support@fasalneeti.com', '_blank')}
                    className="btn-outline text-sm py-2 px-4 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Get Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crop Management Tab */}
        {activeTab === 'yield-prediction' && (
          <div className="animate-fade-in space-y-6">
            <CropManagement farmerData={farmerData} />
            
            {/* Soil Health Monitor */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                  Soil Health Monitoring
                </h2>
                <button
                  onClick={() => setShowSoilHealth(!showSoilHealth)}
                  className="btn-outline text-sm"
                >
                  {showSoilHealth ? 'Hide' : 'Show'} Soil Health
                </button>
              </div>
              {showSoilHealth && (
                <SoilHealthMonitor 
                  cropId={farmerData.id} 
                  district={weatherLocation} 
                />
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Yield Prediction Chart */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center">
                  <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  Crop Yield Predictions
                </h2>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Based on current conditions for {farmerData.lastCrop || 'your crop'}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yieldPredictionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="AI Predicted Yield (%)"
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#059669"
                      strokeWidth={2}
                      name="Actual Yield (%)"
                      dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimal"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Optimal Potential (%)"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Prediction Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                  <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">Current Prediction</div>
                  <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">{formatNumber(67)}%</div>
                  <div className="text-xs text-primary-600 dark:text-primary-400">Expected yield this month</div>
                </div>
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                  <div className="text-sm text-accent-600 dark:text-accent-400 font-medium mb-1">Improvement Potential</div>
                  <div className="text-2xl font-bold text-accent-700 dark:text-accent-300">+{formatNumber(8)}%</div>
                  <div className="text-xs text-accent-600 dark:text-accent-400">With optimal conditions</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Confidence Level</div>
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{formatNumber(94)}%</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Prediction accuracy</div>
                </div>
              </div>
            </div>

            {/* Stress Detection Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  Crop Health Analysis
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stressDetectionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stressDetectionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Farm Details */}
              <div className="dashboard-card">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                  <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  Farm Profile
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                    <span className="text-secondary-600 dark:text-secondary-400">Farm Size:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.farmSize || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                    <span className="text-secondary-600 dark:text-secondary-400">Soil Type:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.soilType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                    <span className="text-secondary-600 dark:text-secondary-400">Soil pH:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.soilPH || 'Not tested'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                    <span className="text-secondary-600 dark:text-secondary-400">Current Crop:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.lastCrop}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                    <span className="text-secondary-600 dark:text-secondary-400">Irrigation:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.irrigationType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-secondary-600 dark:text-secondary-400">Experience:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{farmerData.farmingExperience || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Current Weather */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center">
                  <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  Current Weather Conditions
                </h2>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    weatherData.source === 'OpenWeather API' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-secondary-600 dark:text-secondary-400">
                    {weatherData.source === 'OpenWeather API' ? 'Live Weather' : 'Demo Weather'} - {weatherLocation}
                    <br />
                    <span className="text-xs opacity-75">
                      Source: {weatherData.source || 'Mock Data'} | Updated: {new Date().toLocaleTimeString()}
                    </span>
                  </span>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-xs text-primary-600 hover:text-primary-700 underline ml-2"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-yellow-800 dark:text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-secondary-900 dark:text-white">{formatNumber(weatherData.current.temperature)}°C</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">Temperature</div>
                </div>
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(weatherData.current.humidity)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                </div>
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">🌧️</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(weatherData.current.rainfall)}mm</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rainfall</div>
                </div>
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">💨</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(weatherData.current.windSpeed)} km/h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                </div>
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">6</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">UV Index</div>
                </div>
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(weatherData.current.soilMoisture)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Soil Moisture</div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">📅</span>
                5-Day Forecast (5 दिन का पूर्वानुमान)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {weatherData.forecast.length > 0 ? (
                  weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-earth-50 to-crop-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{day.day}</div>
                      <div className="text-3xl mb-2">{day.icon}</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{day.temp}°C</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{day.condition}</div>
                    </div>
                  ))
                ) : (
                  // Fallback forecast
                  ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'].map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-earth-50 to-crop-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{day}</div>
                      <div className="text-3xl mb-2">☀️</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{28 - index}°C</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Sunny</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Fertilizer Recommendations */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                Smart Recommendations
              </h2>
              <div className="space-y-4">
                {fertilizerRecommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{rec.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        rec.status === 'increase' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        rec.status === 'decrease' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {rec.status === 'increase' ? '↑ Increase' : rec.status === 'decrease' ? '↓ Decrease' : '✓ Optimal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Recommended: </span>
                        <span className="font-medium text-gray-900 dark:text-white">{rec.recommended}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Current: </span>
                        <span className="font-medium text-gray-900 dark:text-white">{rec.current}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{rec.advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                Expert Farming Tips
              </h2>
              <div className="space-y-4">
                <div className="alert-success">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Best Practices for Your Farm
                  </h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Maintain optimal soil moisture levels (45-60%)
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Use organic fertilizers for sustainable growth
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Monitor crop health weekly for early detection
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Follow integrated pest management practices
                    </li>
                  </ul>
                </div>
                
                <div className="alert-warning">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Important Precautions
                  </h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Avoid overwatering - check soil moisture before irrigation
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Stay updated with weather forecasts for planning
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Regular pest monitoring prevents major infestations
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Test soil pH annually for optimal nutrient management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Profile Information */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Farmer Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Name:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Email:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Mobile:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.mobile}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-secondary-600 dark:text-secondary-400">Location:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Farm Information */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Farm Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Farm Size:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.farmSize || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Soil Type:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.soilType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary-100 dark:border-secondary-700">
                      <span className="text-secondary-600 dark:text-secondary-400">Current Crop:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.lastCrop}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-secondary-600 dark:text-secondary-400">Experience:</span>
                      <span className="font-medium text-secondary-900 dark:text-white">{farmerData.farmingExperience || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-primary-200 dark:border-secondary-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleEditProfile}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                  <button 
                    onClick={() => farmerService.downloadFarmerData()}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Data</span>
                  </button>
                  <button 
                    onClick={() => window.open('mailto:support@fasalneeti.com?subject=Help Request&body=Hello, I need help with...', '_blank')}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Help & Support</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Account Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">

                  
                  <div className="flex items-center justify-between p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-secondary-900 dark:text-white">Weather Alerts</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Get weather-based farming alerts</p>
                    </div>
                    <button className="bg-accent-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <h3 className="font-medium text-secondary-900 dark:text-white mb-2">Data Privacy</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">Your farming data is secure and private</p>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Privacy Policy
                    </button>
                  </div>
                  
                  <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <h3 className="font-medium text-secondary-900 dark:text-white mb-2">Account Security</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">Manage your account security settings</p>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weather Alerts */}
      {showWeatherAlerts && (
        <WeatherAlerts 
          district={weatherLocation}
          onClose={() => setShowWeatherAlerts(false)}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                Edit Profile
              </h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={editFormData.mobile || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location || ''}
                  onChange={handleEditFormChange}
                  placeholder="State, District"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Farm Size
                </label>
                <input
                  type="text"
                  name="farmSize"
                  value={editFormData.farmSize || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., 5 acres"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Current Crop
                </label>
                <input
                  type="text"
                  name="lastCrop"
                  value={editFormData.lastCrop || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-6 mt-6 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 bg-secondary-300 hover:bg-secondary-400 text-secondary-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
