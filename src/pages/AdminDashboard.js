import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { mockFarmers, regionalAnalytics, stressDetectionData } from '../data/mockData';
import adminService from '../services/adminService';
import authService from '../services/authService';

/**
 * Admin Dashboard Component
 * Features: Farmer management, analytics, reports, regional data
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [farmers, setFarmers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Load admin data on component mount
  useEffect(() => {
    const loadAdminData = async () => {
      const user = authService.getUser();
      const token = authService.getToken();
      
      if (!user || !token || user.role !== 'admin') {
        navigate('/admin-login');
        return;
      }
      
      setAdminData(user);
      
      try {
        const [farmersResult, predictionsResult] = await Promise.all([
          adminService.getAllFarmers(),
          adminService.getAllPredictions()
        ]);
        
        if (farmersResult.success) {
          setFarmers(farmersResult.data);
        } else {
          setFarmers(mockFarmers);
        }
        
        if (predictionsResult.success) {
          setPredictions(predictionsResult.data);
        }
      } catch (error) {
        setFarmers(mockFarmers);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdminData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Handle farmer deletion
  const handleDeleteFarmer = async (farmerId) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      const result = await adminService.deleteFarmer(farmerId);
      if (result.success) {
        setFarmers(farmers.filter(farmer => farmer.id !== farmerId));
        alert('Farmer deleted successfully!');
      } else {
        alert('Failed to delete farmer: ' + result.error);
      }
    }
  };

  // Handle farmer edit
  const handleEditFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setEditFormData({
      name: farmer.name,
      mobile: farmer.mobile,
      location: farmer.location
    });
    setShowFarmerModal(true);
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  // Save farmer changes
  const handleSaveFarmer = async () => {
    const result = await adminService.updateFarmer(selectedFarmer.id, editFormData);
    if (result.success) {
      setFarmers(farmers.map(farmer => 
        farmer.id === selectedFarmer.id ? { ...farmer, ...editFormData } : farmer
      ));
      alert('Farmer details updated successfully!');
      setShowFarmerModal(false);
    } else {
      alert('Failed to update farmer: ' + result.error);
    }
  };

  // Generate report (mock function)
  const generateReport = (type) => {
    const reportData = {
      farmers: farmers.length,
      regions: regionalAnalytics.length,
      totalAlerts: regionalAnalytics.reduce((sum, region) => sum + region.stressAlerts, 0),
      avgYield: (regionalAnalytics.reduce((sum, region) => sum + region.avgYield, 0) / regionalAnalytics.length).toFixed(1)
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasalneeti-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!adminData || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard tabs configuration
  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'farmers', name: 'Farmers', icon: '👨‍🌾' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'reports', name: 'Reports', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-crop-50 dark:from-gray-900 dark:to-gray-800">
      
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">👨‍💼</span>
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {adminData.username} • FasalNeeti Management Portal
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-earth-500 text-earth-600 dark:text-earth-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
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
          <div className="space-y-8 fade-in">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl mb-2">👨‍🌾</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{farmers.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Farmers</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{regionalAnalytics.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Regions Covered</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {regionalAnalytics.reduce((sum, region) => sum + region.stressAlerts, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(regionalAnalytics.reduce((sum, region) => sum + region.avgYield, 0) / regionalAnalytics.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Yield</div>
              </div>
            </div>

            {/* Regional Overview Chart */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">🗺️</span>
                Regional Overview (क्षेत्रीय अवलोकन)
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="farmers" fill="#d18b56" name="Farmers" />
                    <Bar dataKey="avgYield" fill="#22c55e" name="Avg Yield %" />
                    <Bar dataKey="stressAlerts" fill="#ef4444" name="Stress Alerts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Farmers Tab */}
        {activeTab === 'farmers' && (
          <div className="space-y-8 fade-in">
            
            {/* Farmers Table */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">👨‍🌾</span>
                  Registered Farmers ({farmers.length})
                </h2>
                <button
                  onClick={() => generateReport('farmers')}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Export Data
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Farmer Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Crop & Soil
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {farmers.map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {farmer.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              📱 {farmer.mobile}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            📍 {farmer.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            🌾 {farmer.lastCrop}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            🌱 {farmer.soilType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(farmer.registrationDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditFarmer(farmer)}
                            className="text-earth-600 hover:text-earth-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFarmer(farmer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 fade-in">
            
            {/* Yield Trends */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">📈</span>
                Yield Trends by Region
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={regionalAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgYield"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="Average Yield %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stress Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Overall Stress Distribution
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

              {/* Regional Alerts */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">🚨</span>
                  Stress Alerts by Region
                </h2>
                <div className="space-y-3">
                  {regionalAnalytics
                    .sort((a, b) => b.stressAlerts - a.stressAlerts)
                    .map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{region.region}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{region.farmers} farmers</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        region.stressAlerts > 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        region.stressAlerts > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {region.stressAlerts} alerts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8 fade-in">
            
            {/* Report Generation */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">📋</span>
                Generate Reports
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">👨‍🌾</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Farmers Report</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Complete list of registered farmers with their details
                  </p>
                  <button
                    onClick={() => generateReport('farmers')}
                    className="btn-primary w-full"
                  >
                    Download
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Report</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Regional analytics and yield trends data
                  </p>
                  <button
                    onClick={() => generateReport('analytics')}
                    className="btn-primary w-full"
                  >
                    Download
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Alerts Report</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Stress alerts and emergency notifications
                  </p>
                  <button
                    onClick={() => generateReport('alerts')}
                    className="btn-primary w-full"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* System Statistics */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">📈</span>
                System Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-earth-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-earth-600 dark:text-earth-400">95.2%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-crop-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-crop-600 dark:text-crop-400">1.2TB</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Data Processed</div>
                </div>
                <div className="text-center p-4 bg-soil-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-soil-600 dark:text-soil-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.1%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Farmer Edit Modal */}
      {showFarmerModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Farmer: {selectedFarmer.name}
              </h3>
              <button
                onClick={() => setShowFarmerModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-earth-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={editFormData.mobile || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-earth-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-earth-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveFarmer}
                  className="flex-1 bg-earth-600 hover:bg-earth-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
