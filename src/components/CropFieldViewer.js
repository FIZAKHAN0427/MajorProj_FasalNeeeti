import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CropFieldViewer = ({ crops, district, onClose }) => {
  const districtCenter = {
    'Lucknow': [26.8467, 80.9462],
    'Kanpur': [26.4499, 80.3319],
    'Agra': [27.1767, 78.0081],
    'South Andaman': [11.6, 92.7],
    'North and Middle Andaman': [12.5, 92.9],
    'Nicobar': [8.2, 93.5]
  };

  const center = districtCenter[district] || [20.5937, 78.9629];
  
  const cropColors = {
    'Rice': '#4CAF50',
    'Wheat': '#FF9800',
    'Maize': '#FFEB3B',
    'Sugarcane': '#8BC34A',
    'Cotton': '#E91E63'
  };

  const cropsWithCoordinates = crops.filter(crop => 
    crop.landCoordinates && crop.landCoordinates.length > 2
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-lg w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                🗺️ Crop Fields - {district}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {cropsWithCoordinates.length} mapped fields
              </p>
            </div>
            <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700 text-2xl">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            
            {cropsWithCoordinates.map((crop) => (
              <Polygon
                key={crop._id}
                positions={crop.landCoordinates}
                pathOptions={{
                  color: cropColors[crop.crop] || '#2196F3',
                  fillColor: cropColors[crop.crop] || '#2196F3',
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">{crop.crop}</h4>
                    <p>Season: {crop.season} {crop.year}</p>
                    <p>Area: {crop.area} ha</p>
                    {crop.variety && <p>Variety: {crop.variety}</p>}
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        </div>

        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-sm">
              {Object.entries(cropColors).map(([crop, color]) => (
                <div key={crop} className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                  <span>{crop}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="px-4 py-2 bg-secondary-300 hover:bg-secondary-400 text-secondary-700 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropFieldViewer;