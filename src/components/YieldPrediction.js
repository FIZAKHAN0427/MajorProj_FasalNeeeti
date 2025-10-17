import React, { useState, useEffect } from 'react';
import yieldPredictionService from '../services/yieldPredictionService';
import { indiaData } from '../data/indiaData';
import { formatNumber, formatInteger } from '../utils/formatNumber';

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    crop: '',
    season: '',
    year: new Date().getFullYear(),
    area: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const states = Object.keys(indiaData);
  const crops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'];
  const seasons = ['Kharif', 'Rabi', 'Summer'];
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  const getDistricts = () => {
    return formData.state ? indiaData[formData.state] : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await yieldPredictionService.predictYield(formData);
    
    if (result.success) {
      setPrediction(result.data);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'state' && { district: '' }) // Reset district when state changes
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Crop Yield Prediction
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              District
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={!formData.state}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white disabled:opacity-50"
            >
              <option value="">{formData.state ? 'Select District' : 'Select State First'}</option>
              {getDistricts().map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Crop
            </label>
            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            >
              <option value="">Select Crop</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Season
            </label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            >
              <option value="">Select Season</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Area (hectares)
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter area in hectares"
              min="0.1"
              step="0.1"
              required
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </button>
          </div>
        </form>
      </div>

      {prediction && (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
            Prediction Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {formatNumber(prediction.predicted_yield)} kg/ha
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-400">
                Predicted Yield
              </div>
            </div>

            <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {formatInteger(prediction.total_production)} kg
              </div>
              <div className="text-sm text-accent-700 dark:text-accent-400">
                Total Production ({formatNumber(prediction.area)} ha)
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {formatNumber(prediction.confidence)}%
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-400">
                Confidence Level
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="text-lg font-bold text-secondary-900 dark:text-white">
                {formatNumber(prediction.factors.ndvi_mean)}
              </div>
              <div className="text-xs text-secondary-600 dark:text-secondary-400">
                NDVI Mean
              </div>
            </div>
            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="text-lg font-bold text-secondary-900 dark:text-white">
                {formatNumber(prediction.factors.rainfall_mm)}mm
              </div>
              <div className="text-xs text-secondary-600 dark:text-secondary-400">
                Rainfall
              </div>
            </div>
            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="text-lg font-bold text-secondary-900 dark:text-white">
                {formatNumber(prediction.factors.temp_avg)}°C
              </div>
              <div className="text-xs text-secondary-600 dark:text-secondary-400">
                Temperature
              </div>
            </div>
            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="text-lg font-bold text-secondary-900 dark:text-white">
                {formatNumber(prediction.factors.soil_ph)}
              </div>
              <div className="text-xs text-secondary-600 dark:text-secondary-400">
                Soil pH
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-sm">
              <strong>Analysis:</strong> Based on satellite data (NDVI: {formatNumber(prediction.factors.ndvi_mean)}), 
              weather conditions ({formatNumber(prediction.factors.rainfall_mm)}mm rainfall, {formatNumber(prediction.factors.temp_avg)}°C), 
              and soil pH ({formatNumber(prediction.factors.soil_ph)}), the predicted yield for {prediction.crop} 
              in {prediction.district}, {prediction.state} during {prediction.season} {prediction.year} is {formatNumber(prediction.predicted_yield)} kg/ha.
              {prediction.total_production && (
                <> For your {formatNumber(prediction.area)} hectare farm, the total expected production is {formatInteger(prediction.total_production)} kg.</>  
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldPrediction;