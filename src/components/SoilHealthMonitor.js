import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const SoilHealthMonitor = ({ cropId, district }) => {
  const [soilData] = useState({
    current: {
      ph: 6.8,
      nitrogen: 75,
      phosphorus: 45,
      potassium: 82,
      organicMatter: 3.2,
      moisture: 68,
      temperature: 24
    },
    history: [
      { month: 'Jan', ph: 6.5, nitrogen: 70, phosphorus: 40, potassium: 78 },
      { month: 'Feb', ph: 6.6, nitrogen: 72, phosphorus: 42, potassium: 80 },
      { month: 'Mar', ph: 6.7, nitrogen: 74, phosphorus: 44, potassium: 81 },
      { month: 'Apr', ph: 6.8, nitrogen: 75, phosphorus: 45, potassium: 82 }
    ],
    recommendations: [
      { nutrient: 'Nitrogen', status: 'good', action: 'Maintain current levels' },
      { nutrient: 'Phosphorus', status: 'low', action: 'Apply DAP fertilizer' },
      { nutrient: 'Potassium', status: 'excellent', action: 'No action needed' }
    ]
  });

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

  const radialData = [
    { name: 'Health Score', value: healthScore, fill: scoreColor }
  ];

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
          🧪 Soil Health Monitor - {district}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Score */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Overall Health Score</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill={scoreColor} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-3xl font-bold" style={{ color: scoreColor }}>
              {healthScore}%
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </p>
          </div>

          {/* Current Readings */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Current Readings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">pH Level</div>
                <div className="text-xl font-bold">{soilData.current.ph}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Nitrogen</div>
                <div className="text-xl font-bold">{soilData.current.nitrogen}%</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Phosphorus</div>
                <div className="text-xl font-bold">{soilData.current.phosphorus}%</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Potassium</div>
                <div className="text-xl font-bold">{soilData.current.potassium}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Nutrient Trends (Last 4 Months)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={soilData.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="nitrogen" stroke="#10B981" name="Nitrogen" />
                <Line type="monotone" dataKey="phosphorus" stroke="#3B82F6" name="Phosphorus" />
                <Line type="monotone" dataKey="potassium" stroke="#8B5CF6" name="Potassium" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6">
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