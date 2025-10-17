import React, { useState, useEffect } from 'react';

const WeatherAlerts = ({ district, onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWeatherAlerts();
  }, [district]);

  const generateWeatherAlerts = () => {
    // Mock weather alerts based on conditions
    const mockAlerts = [
      {
        id: 1,
        type: 'warning',
        severity: 'high',
        title: 'Heavy Rainfall Expected',
        message: 'Heavy rainfall (50-80mm) expected in next 24 hours. Ensure proper drainage.',
        icon: '🌧️',
        action: 'Check drainage systems',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'caution',
        severity: 'medium',
        title: 'High Temperature Alert',
        message: 'Temperature may reach 38°C. Increase irrigation frequency.',
        icon: '🌡️',
        action: 'Schedule extra watering',
        validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'info',
        severity: 'low',
        title: 'Favorable Conditions',
        message: 'Good weather for pesticide application. Low wind, moderate humidity.',
        icon: '☀️',
        action: 'Consider pest control',
        validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
      }
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-4 z-50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
          <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto z-50 space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border-l-4 rounded-lg p-4 shadow-lg ${getSeverityColor(alert.severity)} bg-white dark:bg-secondary-800`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{alert.icon}</span>
              <h4 className="font-semibold text-secondary-900 dark:text-white text-sm">
                {alert.title}
              </h4>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-secondary-400 hover:text-secondary-600 text-sm"
            >
              ✕
            </button>
          </div>
          
          <p className="text-xs text-secondary-700 dark:text-secondary-300 mb-2">
            {alert.message}
          </p>
          
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-primary-600 dark:text-primary-400">
              💡 {alert.action}
            </span>
            <span className="text-secondary-500">
              {alert.validUntil.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
      ))}
      
      {alerts.length === 0 && (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-4">
          <div className="text-center">
            <span className="text-2xl">✅</span>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              No weather alerts for {district}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;