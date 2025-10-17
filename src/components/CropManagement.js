import React, { useState, useEffect } from 'react';
import { indiaData } from '../data/indiaData';
import { formatNumber, formatInteger } from '../utils/formatNumber';
import yieldPredictionService from '../services/yieldPredictionService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LandMapSelector from './LandMapSelector';
import CropFieldViewer from './CropFieldViewer';
import PhotoUpload from './PhotoUpload';
import MarketPrices from './MarketPrices';

const CropManagement = ({ farmerData }) => {
  const [crops, setCrops] = useState([]);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [selectedLandArea, setSelectedLandArea] = useState([]);
  const [showFieldViewer, setShowFieldViewer] = useState(false);
  const [cropPhotos, setCropPhotos] = useState([]);
  const [cropFormData, setCropFormData] = useState({
    state: '',
    district: '',
    crop: '',
    season: '',
    year: new Date().getFullYear(),
    area: '',
    landCoordinates: [],
    photos: [],
    variety: '',
    plantingDate: '',
    expectedHarvest: ''
  });

  const states = Object.keys(indiaData);
  const getDistricts = () => {
    return cropFormData.state ? indiaData[cropFormData.state] : [];
  };

  const cropTypes = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'];
  const seasons = ['Kharif', 'Rabi', 'Summer'];
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  useEffect(() => {
    if (farmerData && (farmerData.id || farmerData._id)) {
      loadCrops();
    }
  }, [farmerData]);

  const loadCrops = async () => {
    try {
      console.log('Loading crops...');
      const response = await fetch(`http://localhost:5001/api/farmer/crops`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Load crops failed:', response.status, text);
        return;
      }
      
      const result = await response.json();
      console.log('Load crops result:', result);
      if (result.success) {
        setCrops(result.data);
      }
    } catch (error) {
      console.error('Failed to load crops from database:', error);
    }
  };

  const handleAddCrop = async () => {
    try {
      // Validate required fields
      if (!cropFormData.state || !cropFormData.district || !cropFormData.crop || !cropFormData.season || !cropFormData.area) {
        alert('Please fill all required fields');
        return;
      }
      
      console.log('Adding crop:', cropFormData);
      console.log('Land coordinates being sent:', cropFormData.landCoordinates);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await fetch(`http://localhost:5001/api/farmer/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cropFormData)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Add crop failed:', response.status, text);
        alert(`Failed to add crop: Server error ${response.status}`);
        return;
      }
      
      const result = await response.json();
      if (result.success) {
        setCrops([...crops, result.data]);
        setCropFormData({
          state: '',
          district: '',
          crop: '',
          season: '',
          year: new Date().getFullYear(),
          area: '',
          landCoordinates: [],
          variety: '',
          plantingDate: '',
          expectedHarvest: ''
        });
        setSelectedLandArea([]);
        setShowAddCrop(false);
      } else {
        alert(`Failed to add crop: ${result.error || result.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Add crop error:', error);
      alert(`Failed to add crop: ${error.message}`);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/farmer/crops/${cropId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setCrops(crops.filter(crop => crop._id !== cropId));
      }
    } catch (error) {
      alert('Failed to delete crop');
    }
  };

  const handleMapAreaSelect = (coordinates, calculatedArea) => {
    console.log('Map area selected:', coordinates);
    console.log('Calculated area:', calculatedArea);
    setSelectedLandArea(coordinates);
    setCropFormData({
      ...cropFormData,
      area: calculatedArea.toString(),
      landCoordinates: coordinates
    });
    console.log('Updated cropFormData:', {
      ...cropFormData,
      area: calculatedArea.toString(),
      landCoordinates: coordinates
    });
  };

  const handlePredictYield = async (crop) => {
    try {
      const result = await yieldPredictionService.predictYield({
        state: crop.state,
        district: crop.district,
        crop: crop.crop,
        season: crop.season,
        year: crop.year,
        area: crop.area
      });
      
      if (result.success) {
        setSelectedCrop(crop);
        setAnalyticsData(result.data);
        setShowAnalytics(true);
      } else {
        // Use mock data if API fails
        const mockData = {
          predicted_yield: 3500 + Math.random() * 1000,
          total_production: (3500 + Math.random() * 1000) * parseFloat(crop.area),
          confidence: 85 + Math.random() * 10,
          model_used: 'Mock ML Model',
          factors: {
            ndvi_mean: 0.65 + Math.random() * 0.1,
            temp_avg: 25 + Math.random() * 8,
            humidity: 60 + Math.random() * 20,
            soil_ph: 6.5 + Math.random() * 1
          },
          weather: {
            temp_avg: 26 + Math.random() * 6,
            wind_speed: 8 + Math.random() * 5,
            rainfall_mm: Math.random() * 10,
            description: 'partly cloudy'
          }
        };
        setSelectedCrop(crop);
        setAnalyticsData(mockData);
        setShowAnalytics(true);
      }
    } catch (error) {
      // Use mock data as fallback
      const mockData = {
        predicted_yield: 3500 + Math.random() * 1000,
        total_production: (3500 + Math.random() * 1000) * parseFloat(crop.area),
        confidence: 85 + Math.random() * 10,
        model_used: 'Mock ML Model (Offline)',
        factors: {
          ndvi_mean: 0.65 + Math.random() * 0.1,
          temp_avg: 25 + Math.random() * 8,
          humidity: 60 + Math.random() * 20,
          soil_ph: 6.5 + Math.random() * 1
        },
        weather: {
          temp_avg: 26 + Math.random() * 6,
          wind_speed: 8 + Math.random() * 5,
          rainfall_mm: Math.random() * 10,
          description: 'partly cloudy'
        }
      };
      setSelectedCrop(crop);
      setAnalyticsData(mockData);
      setShowAnalytics(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          My Crops
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFieldViewer(true)}
            disabled={crops.filter(c => c.landCoordinates?.length > 0).length === 0}
            className="btn-outline flex items-center space-x-2 disabled:opacity-50"
          >
            <span>🗺️</span>
            <span>View Fields</span>
          </button>
          <button
            onClick={() => setShowAddCrop(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Crop</span>
          </button>
        </div>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            No crops added yet
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Add your first crop to start tracking and get yield predictions
          </p>
          <button
            onClick={() => setShowAddCrop(true)}
            className="btn-primary"
          >
            Add Your First Crop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div key={crop._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                    {crop.crop}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {crop.season} {crop.year}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCrop(crop._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-400">Location:</span>
                  <span className="font-medium">{crop.district}, {crop.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-400">Area:</span>
                  <span className="font-medium">
                    {formatNumber(crop.area)} ha
                    {crop.landCoordinates && crop.landCoordinates.length > 0 && (
                      <span className="ml-1 text-green-500" title="GPS mapped area">🗺️</span>
                    )}
                  </span>
                </div>
                {crop.variety && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-secondary-400">Variety:</span>
                    <span className="font-medium">{crop.variety}</span>
                  </div>
                )}
                {crop.plantingDate && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-secondary-400">Planted:</span>
                    <span className="font-medium">{new Date(crop.plantingDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handlePredictYield(crop)}
                className="w-full mt-4 btn-outline text-sm py-2"
              >
                Predict Yield
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && analyticsData && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    📊 Yield Analytics - {selectedCrop.crop}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {selectedCrop.district}, {selectedCrop.state} • {selectedCrop.season} {selectedCrop.year}
                  </p>
                </div>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-secondary-500 hover:text-secondary-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">Predicted Yield</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {formatNumber(analyticsData.predicted_yield)} kg/ha
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Production</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatInteger(analyticsData.total_production)} kg
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Confidence</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {Math.round(analyticsData.confidence)}%
                  </div>
                </div>
              </div>

              {/* Environmental Factors Chart */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">🌱 Environmental Factors</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌿</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">NDVI</div>
                      <div className="font-semibold">{analyticsData.factors?.ndvi_mean?.toFixed(2) || 'N/A'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌡️</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Temperature</div>
                      <div className="font-semibold">{analyticsData.factors?.temp_avg?.toFixed(1) || 'N/A'}°C</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💧</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Humidity</div>
                      <div className="font-semibold">{analyticsData.factors?.humidity?.toFixed(0) || 'N/A'}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🧪</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Soil pH</div>
                      <div className="font-semibold">{analyticsData.factors?.soil_ph?.toFixed(1) || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'NDVI', value: (analyticsData.factors?.ndvi_mean || 0) * 100, color: '#10B981' },
                        { name: 'Temp', value: analyticsData.factors?.temp_avg || 0, color: '#F59E0B' },
                        { name: 'Humidity', value: analyticsData.factors?.humidity || 0, color: '#3B82F6' },
                        { name: 'Soil pH', value: (analyticsData.factors?.soil_ph || 0) * 10, color: '#8B5CF6' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'NDVI') return [(value/100).toFixed(2), 'NDVI'];
                          if (name === 'Temp') return [value.toFixed(1) + '°C', 'Temperature'];
                          if (name === 'Humidity') return [value.toFixed(0) + '%', 'Humidity'];
                          if (name === 'Soil pH') return [(value/10).toFixed(1), 'Soil pH'];
                          return [value, name];
                        }} />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Weather Information */}
              {analyticsData.weather && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">🌤️ Current Weather</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌡️</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Temperature</div>
                      <div className="font-semibold">{analyticsData.weather.temp_avg?.toFixed(1)}°C</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💨</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Wind Speed</div>
                      <div className="font-semibold">{analyticsData.weather.wind_speed?.toFixed(1)} km/h</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌧️</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Rainfall</div>
                      <div className="font-semibold">{analyticsData.weather.rainfall_mm?.toFixed(1)} mm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">☁️</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">Condition</div>
                      <div className="font-semibold capitalize">{analyticsData.weather.description}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Yield Comparison Chart */}
              <div className="bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">📈 Yield Analysis</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Predicted Yield', value: analyticsData.predicted_yield, fill: '#10B981' },
                            { name: 'Potential Loss', value: Math.max(0, 5000 - analyticsData.predicted_yield), fill: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip formatter={(value) => [formatNumber(value) + ' kg/ha', '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                      Yield vs Potential
                    </div>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { month: 'Jan', yield: analyticsData.predicted_yield * 0.1 },
                        { month: 'Feb', yield: analyticsData.predicted_yield * 0.2 },
                        { month: 'Mar', yield: analyticsData.predicted_yield * 0.4 },
                        { month: 'Apr', yield: analyticsData.predicted_yield * 0.7 },
                        { month: 'May', yield: analyticsData.predicted_yield * 0.9 },
                        { month: 'Jun', yield: analyticsData.predicted_yield }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatNumber(value) + ' kg/ha', 'Projected Yield']} />
                        <Line type="monotone" dataKey="yield" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                      Growth Projection
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Prices */}
              <MarketPrices crop={selectedCrop.crop} district={selectedCrop.district} />

              {/* Recommendations */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">💡 Recommendations</h4>
                <div className="space-y-3">
                  {analyticsData.confidence > 85 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <p className="text-secondary-700 dark:text-secondary-300">
                        High confidence prediction - conditions are optimal for {selectedCrop.crop} cultivation.
                      </p>
                    </div>
                  )}
                  {analyticsData.factors?.temp_avg > 30 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-500 text-xl">⚠️</span>
                      <p className="text-secondary-700 dark:text-secondary-300">
                        High temperature detected. Consider irrigation scheduling and shade protection.
                      </p>
                    </div>
                  )}
                  {analyticsData.factors?.soil_ph < 6.5 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-500 text-xl">🧪</span>
                      <p className="text-secondary-700 dark:text-secondary-300">
                        Soil pH is slightly acidic. Consider lime application to improve nutrient availability.
                      </p>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl">📈</span>
                    <p className="text-secondary-700 dark:text-secondary-300">
                      Monitor crop growth regularly and adjust fertilizer application based on growth stages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Information */}
              <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  <strong>Model Used:</strong> {analyticsData.model_used || 'Advanced ML Model'} • 
                  <strong>Area:</strong> {selectedCrop.area} ha • 
                  <strong>Prediction Date:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 p-6">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="px-6 py-2 bg-secondary-300 hover:bg-secondary-400 text-secondary-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const data = `Crop: ${selectedCrop.crop}\nLocation: ${selectedCrop.district}, ${selectedCrop.state}\nSeason: ${selectedCrop.season} ${selectedCrop.year}\nArea: ${selectedCrop.area} ha\nPredicted Yield: ${formatNumber(analyticsData.predicted_yield)} kg/ha\nTotal Production: ${formatInteger(analyticsData.total_production)} kg\nConfidence: ${Math.round(analyticsData.confidence)}%`;
                    navigator.clipboard.writeText(data);
                    alert('Analytics data copied to clipboard!');
                  }}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  📋 Copy Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                Add New Crop
              </h3>
              <button
                onClick={() => setShowAddCrop(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    State *
                  </label>
                  <select
                    value={cropFormData.state}
                    onChange={(e) => setCropFormData({...cropFormData, state: e.target.value, district: ''})}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    District *
                  </label>
                  <select
                    value={cropFormData.district}
                    onChange={(e) => setCropFormData({...cropFormData, district: e.target.value})}
                    disabled={!cropFormData.state}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="">{cropFormData.state ? 'Select District' : 'Select State First'}</option>
                    {getDistricts().map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Crop *
                </label>
                <select
                  value={cropFormData.crop}
                  onChange={(e) => setCropFormData({...cropFormData, crop: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                >
                  <option value="">Select Crop</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Season *
                  </label>
                  <select
                    value={cropFormData.season}
                    onChange={(e) => setCropFormData({...cropFormData, season: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                  >
                    <option value="">Select Season</option>
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Year *
                  </label>
                  <select
                    value={cropFormData.year}
                    onChange={(e) => setCropFormData({...cropFormData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Area (hectares) *
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={cropFormData.area}
                      onChange={(e) => {
                        setCropFormData({...cropFormData, area: e.target.value});
                        if (e.target.value && selectedLandArea.length > 0) {
                          setSelectedLandArea([]);
                          setCropFormData(prev => ({...prev, landCoordinates: []}));
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                      placeholder="Enter area manually"
                      min="0.1"
                      step="0.1"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMapSelector(true)}
                      disabled={!cropFormData.district}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                      title="Select area on map (optional)"
                    >
                      🗺️ Map
                    </button>
                  </div>
                  
                  {selectedLandArea.length > 0 ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        ✅ GPS area mapped ({selectedLandArea.length} points)
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLandArea([]);
                          setCropFormData(prev => ({...prev, area: '', landCoordinates: []}));
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Clear Map
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      💡 Optional: Use map to precisely mark your land boundaries
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Variety (Optional)
                </label>
                <input
                  type="text"
                  value={cropFormData.variety}
                  onChange={(e) => setCropFormData({...cropFormData, variety: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                  placeholder="e.g., Basmati, IR64"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Planting Date (Optional)
                </label>
                <input
                  type="date"
                  value={cropFormData.plantingDate}
                  onChange={(e) => setCropFormData({...cropFormData, plantingDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                />
              </div>
              
              <PhotoUpload
                onPhotoSelect={(photos) => setCropFormData({...cropFormData, photos})}
                existingPhotos={cropPhotos}
              />
            </div>
            
            <div className="flex space-x-3 pt-6 mt-6 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={handleAddCrop}
                disabled={!cropFormData.state || !cropFormData.district || !cropFormData.crop || !cropFormData.season || !cropFormData.area}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Crop
              </button>
              <button
                onClick={() => setShowAddCrop(false)}
                className="flex-1 bg-secondary-300 hover:bg-secondary-400 text-secondary-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Selector Modal */}
      {showMapSelector && cropFormData.district && (
        <LandMapSelector
          district={cropFormData.district}
          selectedArea={selectedLandArea}
          onAreaSelect={handleMapAreaSelect}
          onClose={() => setShowMapSelector(false)}
        />
      )}

      {/* Crop Field Viewer */}
      {showFieldViewer && (
        <CropFieldViewer
          crops={crops}
          district={crops[0]?.district || 'Lucknow'}
          onClose={() => setShowFieldViewer(false)}
        />
      )}
    </div>
  );
};

export default CropManagement;