import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/formatNumber';

const MarketPrices = ({ crop, district }) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/market-prices?crop=${crop}&district=${district}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setPrices(result.data);
          } else {
            throw new Error('Failed to fetch market prices');
          }
        } else {
          throw new Error('Market prices API unavailable');
        }
      } catch (error) {
        console.error('Market prices error:', error);
        setPrices(null);
      } finally {
        setLoading(false);
      }
    };

    if (crop && district) {
      fetchMarketPrices();
    }
  }, [crop, district]);

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

  if (!prices) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          💰 Market Prices - {crop}
        </h4>
        <p className="text-secondary-600 dark:text-secondary-400">
          Market price data is currently unavailable. Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  const trendColor = prices.trend?.startsWith('+') ? 'text-green-600' : 'text-red-600';
  const trendIcon = prices.trend?.startsWith('+') ? '📈' : '📉';

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
        📍 Prices for {district} market • Updated {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MarketPrices;