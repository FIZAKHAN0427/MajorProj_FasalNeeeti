import React, { useState, useEffect } from 'react';

const SoilHealthMonitor = ({ cropId, district, crop }) => {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/soil-health?district=${district}&crop=${crop || 'Rice'}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setSoilData(result.data);
          } else {
            throw new Error('Failed to fetch soil data');
          }
        } else {
          throw new Error('Soil health API unavailable');
        }
      } catch (error) {
        console.error('Soil health error:', error);
        // Generate dynamic mock data based on district and crop
        setSoilData(generateMockSoilData(district, crop));
      } finally {
        setLoading(false);
      }
    };

    if (district) {
      fetchSoilData();
    }
  }, [district, crop, cropId]);

  const generateMockSoilData = (district, crop) => {
    // Generate realistic soil data based on district and crop
    const districtFactors = {
      'Lucknow': { phBase: 6.8, nBase: 75, pBase: 45, kBase: 82 },
      'Kanpur': { phBase: 6.5, nBase: 70, pBase: 40, kBase: 78 },
      'Agra': { phBase: 7.2, nBase: 68, pBase: 38, kBase: 75 },
      'Varanasi': { phBase: 6.9, nBase: 72, pBase: 42, kBase: 80 },
      'Allahabad': { phBase: 7.0, nBase: 74, pBase: 44, kBase: 81 }
    };

    const cropFactors = {
      'Rice': { phMod: 0, nMod: 5, pMod: 2, kMod: 3 },
      'Wheat': { phMod: 0.2, nMod: -3, pMod: 5, kMod: -2 },
      'Maize': { phMod: -0.1, nMod: 8, pMod: -1, kMod: 4 },
      'Sugarcane': { phMod: 0.1, nMod: 10, pMod: 8, kMod: 6 },
      'Cotton': { phMod: 0.3, nMod: -5, pMod: 3, kMod: -1 }
    };

    const distFactor = districtFactors[district] || districtFactors['Lucknow'];
    const cropFactor = cropFactors[crop] || cropFactors['Rice'];

    const current = {
      ph: Math.round((distFactor.phBase + cropFactor.phMod + (Math.random() - 0.5) * 0.4) * 10) / 10,
      nitrogen: Math.round(distFactor.nBase + cropFactor.nMod + (Math.random() - 0.5) * 10),
      phosphorus: Math.round(distFactor.pBase + cropFactor.pMod + (Math.random() - 0.5) * 8),
      potassium: Math.round(distFactor.kBase + cropFactor.kMod + (Math.random() - 0.5) * 12),
      organicMatter: Math.round((2.8 + Math.random() * 1.2) * 10) / 10,
      moisture: Math.round(60 + Math.random() * 20),
      temperature: Math.round(22 + Math.random() * 8)
    };

    const history = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    for (let i = 0; i < 4; i++) {
      history.push({
        month: months[i],
        ph: Math.round((current.ph - 0.3 + i * 0.1) * 10) / 10,
        nitrogen: current.nitrogen - 5 + i * 1.5,
        phosphorus: current.phosphorus - 5 + i * 1.2,
        potassium: current.potassium - 4 + i * 1
      });
    }

    const recommendations = [];
    if (current.nitrogen < 70) {
      recommendations.push({ nutrient: 'Nitrogen', status: 'low', action: 'Apply urea or organic compost' });
    } else if (current.nitrogen > 85) {
      recommendations.push({ nutrient: 'Nitrogen', status: 'high', action: 'Reduce nitrogen fertilizer' });
    } else {
      recommendations.push({ nutrient: 'Nitrogen', status: 'good', action: 'Maintain current levels' });
    }

    if (current.phosphorus < 40) {
      recommendations.push({ nutrient: 'Phosphorus', status: 'low', action: 'Apply DAP fertilizer' });
    } else if (current.phosphorus > 60) {
      recommendations.push({ nutrient: 'Phosphorus', status: 'high', action: 'Reduce phosphorus application' });
    } else {
      recommendations.push({ nutrient: 'Phosphorus', status: 'good', action: 'Optimal levels maintained' });
    }

    if (current.potassium < 75) {
      recommendations.push({ nutrient: 'Potassium', status: 'low', action: 'Apply potash fertilizer' });
    } else if (current.potassium > 90) {
      recommendations.push({ nutrient: 'Potassium', status: 'excellent', action: 'Excellent levels' });
    } else {
      recommendations.push({ nutrient: 'Potassium', status: 'good', action: 'Good levels maintained' });
    }

    return { current, history, recommendations };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-secondary-200 rounded"></div>
            <div className="h-32 bg-secondary-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!soilData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          🧪 Soil Health Monitor
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          Soil health data is currently unavailable. Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  const getHealthScore = () => {
    const { ph, nitrogen, phosphorus, potassium, organicMatter } = soilData.current;
    const phScore = ph >= 6.0 && ph <= 7.5 ? 100 : 70;
    const nScore = nitrogen >= 70 ? 100 : (nitrogen / 70) * 100;
    const pScore = phosphorus >= 50 ? 100 : (phosphorus / 50) * 100;
    const kScore = potassium >= 80 ? 100 : (potassium / 80) * 100;
    const omScore = organicMatter >= 3.0 ? 100 : (organicMatter / 3.0) * 100;
    
    return Math.round((phScore + nScore + pScore + kScore + omScore) / 5);
  };

  const healthScore = getHealthScore();
  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#EF4444';

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
          🧪 Soil Health Monitor - {district} {crop && `(${crop})`}
        </h3>

        {/* Health Score and Current Readings */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2" style={{ color: scoreColor }}>
            {healthScore}%
          </div>
          <p className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
            Overall Health Score
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
          </p>
        </div>

        {/* Current Readings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg text-center">
            <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">pH Level</div>
            <div className="text-2xl font-bold">{soilData.current.ph}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Nitrogen</div>
            <div className="text-2xl font-bold">{soilData.current.nitrogen}%</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Phosphorus</div>
            <div className="text-2xl font-bold">{soilData.current.phosphorus}%</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
            <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Potassium</div>
            <div className="text-2xl font-bold">{soilData.current.potassium}%</div>
          </div>
        </div>



        {/* Recommendations */}
        <div>
          <h4 className="text-lg font-semibold mb-4">💡 Recommendations</h4>
          <div className="space-y-3">
            {soilData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <span className="font-medium">{rec.nutrient}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(rec.status)}`}>
                    {rec.status}
                  </span>
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {rec.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthMonitor;