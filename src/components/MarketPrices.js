import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/formatNumber';

const MarketPrices = ({ crop, district }) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock market prices (in real app, fetch from API)
  const mockPrices = {
    'Rice': { current: 2800, trend: '+5%', forecast: 2950 },
    'Wheat': { current: 2200, trend: '+2%', forecast: 2250 },
    'Maize': { current: 1800, trend: '-3%', forecast: 1750 },
    'Sugarcane': { current: 350, trend: '+8%', forecast: 380 },
    'Cotton': { current: 6500, trend: '+12%', forecast: 7200 }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrices(mockPrices[crop] || mockPrices['Rice']);
      setLoading(false);
    }, 1000);
  }, [crop]);

  if (loading) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-green-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const trendColor = prices.trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  const trendIcon = prices.trend.startsWith('+') ? '📈' : '📉';

  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
        💰 Market Prices - {crop}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-secondary-600 dark:text-secondary-400">Current Price</div>
          <div className="text-xl font-bold text-green-700 dark:text-green-300">
            ₹{formatNumber(prices.current)}/quintal
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-secondary-600 dark:text-secondary-400">Trend (30 days)</div>
          <div className={`text-lg font-semibold ${trendColor}`}>
            {trendIcon} {prices.trend}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-secondary-600 dark:text-secondary-400">Forecast (3 months)</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            ₹{formatNumber(prices.forecast)}
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-secondary-500 dark:text-secondary-400">
        📍 Prices for {district} market • Updated 2 hours ago
      </div>
    </div>
  );
};

export default MarketPrices;