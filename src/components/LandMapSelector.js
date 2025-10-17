import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LandMapSelector = ({ district, onAreaSelect, selectedArea, onClose }) => {
  const [polygon, setPolygon] = useState(selectedArea || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  // Comprehensive district coordinates
  const getDistrictInfo = (districtName) => {
    const districts = {
      // Andaman and Nicobar Islands
      'Nicobar': { center: [8.2, 93.5], bounds: [[6.5, 92.5], [9.5, 94.5]] },
      'North and Middle Andaman': { center: [12.5, 92.9], bounds: [[11.5, 92.5], [13.5, 93.3]] },
      'South Andaman': { center: [11.6, 92.7], bounds: [[10.5, 92.2], [12.5, 93.2]] },
      
      // Uttar Pradesh
      'Lucknow': { center: [26.8467, 80.9462], bounds: [[26.7, 80.8], [27.0, 81.1]] },
      'Kanpur': { center: [26.4499, 80.3319], bounds: [[26.3, 80.2], [26.6, 80.5]] },
      'Agra': { center: [27.1767, 78.0081], bounds: [[27.0, 77.9], [27.3, 78.2]] },
      'Varanasi': { center: [25.3176, 82.9739], bounds: [[25.2, 82.8], [25.5, 83.1]] },
      'Prayagraj': { center: [25.4358, 81.8463], bounds: [[25.3, 81.7], [25.6, 82.0]] },
      'Allahabad': { center: [25.4358, 81.8463], bounds: [[25.3, 81.7], [25.6, 82.0]] },
      
      // Maharashtra
      'Mumbai City': { center: [19.0760, 72.8777], bounds: [[18.9, 72.7], [19.3, 73.0]] },
      'Mumbai Suburban': { center: [19.2183, 72.9781], bounds: [[19.0, 72.8], [19.4, 73.2]] },
      'Pune': { center: [18.5204, 73.8567], bounds: [[18.4, 73.7], [18.7, 74.0]] },
      'Nashik': { center: [19.9975, 73.7898], bounds: [[19.8, 73.6], [20.2, 74.0]] },
      
      // Karnataka
      'Bengaluru Urban': { center: [12.9716, 77.5946], bounds: [[12.8, 77.4], [13.1, 77.8]] },
      'Bengaluru Rural': { center: [13.2846, 77.6211], bounds: [[13.1, 77.4], [13.5, 77.9]] },
      'Mysuru': { center: [12.2958, 76.6394], bounds: [[12.1, 76.4], [12.5, 76.9]] },
      
      // Tamil Nadu
      'Chennai': { center: [13.0827, 80.2707], bounds: [[12.9, 80.1], [13.3, 80.4]] },
      'Coimbatore': { center: [11.0168, 76.9558], bounds: [[10.8, 76.7], [11.2, 77.2]] },
      'Madurai': { center: [9.9252, 78.1198], bounds: [[9.7, 77.9], [10.1, 78.4]] },
      
      // West Bengal
      'Kolkata': { center: [22.5726, 88.3639], bounds: [[22.4, 88.2], [22.7, 88.5]] },
      'North 24 Parganas': { center: [22.6757, 88.8095], bounds: [[22.5, 88.6], [22.9, 89.0]] },
      
      // Delhi
      'Central Delhi': { center: [28.6519, 77.2315], bounds: [[28.6, 77.2], [28.7, 77.3]] },
      'New Delhi': { center: [28.6139, 77.2090], bounds: [[28.5, 77.1], [28.7, 77.3]] },
      'South Delhi': { center: [28.5355, 77.2490], bounds: [[28.4, 77.1], [28.7, 77.4]] },
      
      // Gujarat
      'Ahmedabad': { center: [23.0225, 72.5714], bounds: [[22.9, 72.4], [23.2, 72.7]] },
      'Surat': { center: [21.1702, 72.8311], bounds: [[21.0, 72.7], [21.3, 73.0]] },
      
      // Rajasthan
      'Jaipur': { center: [26.9124, 75.7873], bounds: [[26.7, 75.6], [27.1, 76.0]] },
      'Jodhpur': { center: [26.2389, 73.0243], bounds: [[26.0, 72.8], [26.5, 73.3]] },
      
      // Punjab
      'Amritsar': { center: [31.6340, 74.8723], bounds: [[31.5, 74.7], [31.8, 75.0]] },
      'Ludhiana': { center: [30.9010, 75.8573], bounds: [[30.7, 75.7], [31.1, 76.0]] },
      
      // Haryana
      'Gurugram': { center: [28.4595, 77.0266], bounds: [[28.3, 76.9], [28.6, 77.2]] },
      'Faridabad': { center: [28.4089, 77.3178], bounds: [[28.3, 77.2], [28.5, 77.4]] }
    };
    
    return districts[districtName] || {
      center: [20.5937, 78.9629], // Center of India
      bounds: [[20.0, 78.0], [21.0, 79.0]]
    };
  };

  const districtInfo = getDistrictInfo(district);
  const center = districtInfo.center;
  const districtBounds = districtInfo.bounds;

  // Calculate area from polygon coordinates (rough approximation)
  const calculateArea = (coords) => {
    if (coords.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (very rough approximation)
    return (area * 111000 * 111000 / 10000).toFixed(2);
  };

  // Check if point is within district bounds
  const isPointInDistrict = (lat, lng) => {
    return lat >= districtBounds[0][0] && lat <= districtBounds[1][0] &&
           lng >= districtBounds[0][1] && lng <= districtBounds[1][1];
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (isDrawing) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          
          if (isPointInDistrict(lat, lng)) {
            const newPoint = [lat, lng];
            setCurrentPath(prev => [...prev, newPoint]);
          } else {
            alert(`Please select points within ${district} district boundaries`);
          }
        }
      }
    });
    return null;
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setCurrentPath([]);
    setPolygon([]);
  };

  const finishDrawing = () => {
    if (currentPath.length >= 3) {
      setPolygon(currentPath);
      const area = calculateArea(currentPath);
      onAreaSelect(currentPath, parseFloat(area));
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearSelection = () => {
    setPolygon([]);
    setCurrentPath([]);
    setIsDrawing(false);
    onAreaSelect([], 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                🗺️ Select Your Crop Land - {district}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Click within the red boundary to draw your crop land area
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={11}
            key={district}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* District boundary */}
            <Rectangle
              bounds={districtBounds}
              pathOptions={{ color: 'red', fillColor: 'transparent', weight: 2, dashArray: '5, 5' }}
            />
            
            <MapEvents />
            
            {/* Show current drawing path */}
            {currentPath.length > 0 && (
              <Polygon
                positions={currentPath}
                pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.3 }}
              />
            )}
            
            {/* Show selected polygon */}
            {polygon.length > 0 && !isDrawing && (
              <Polygon
                positions={polygon}
                pathOptions={{ color: 'green', fillColor: 'lightgreen', fillOpacity: 0.5 }}
              />
            )}
          </MapContainer>

          {/* Drawing instructions overlay */}
          {isDrawing && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Drawing Mode Active</p>
              <p className="text-xs">Click within {district} boundary</p>
              <p className="text-xs">Points: {currentPath.length}</p>
            </div>
          )}

          {/* Area display */}
          {polygon.length > 0 && (
            <div className="absolute top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Selected Area</p>
              <p className="text-lg font-bold">{calculateArea(polygon)} ha</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {!isDrawing ? (
                <button
                  onClick={startDrawing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  🖊️ Draw Land Boundary
                </button>
              ) : (
                <button
                  onClick={finishDrawing}
                  disabled={currentPath.length < 3}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  ✅ Finish Drawing ({currentPath.length} points)
                </button>
              )}
              
              {polygon.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  🗑️ Clear
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary-300 hover:bg-secondary-400 text-secondary-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {polygon.length > 0 && (
                <button
                  onClick={() => {
                    const area = calculateArea(polygon);
                    onAreaSelect(polygon, parseFloat(area));
                    onClose();
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Use Selected Area
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandMapSelector;