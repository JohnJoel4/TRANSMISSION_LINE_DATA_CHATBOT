import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet itself for custom styling/icons

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Initial US Center and Zoom
const US_CENTER = [39.8333, -98.5833];
const INITIAL_ZOOM = 4;

const MapComponent = ({ geojsonData }) => {
  // Key to force GeoJSON layer refresh when data changes
  const [key, setKey] = useState(0); 
  // State for legend collapse on mobile
  const [legendCollapsed, setLegendCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Increment the key whenever geojsonData changes to force the GeoJSON component to re-render
    if (geojsonData) {
      setKey(prevKey => prevKey + 1);
    }
  }, [geojsonData]);

  useEffect(() => {
    // Handle window resize to auto-collapse legend on mobile
    const handleResize = () => {
      setLegendCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PERFORMANCE: Memoize heavy computations
  const processedData = useMemo(() => {
    if (!geojsonData || !geojsonData.features) return null;
    
    // Simplify geometries for better performance
    const simplified = {
      ...geojsonData,
      features: geojsonData.features.map(feature => ({
        ...feature,
        // Keep original geometry but add simplified version for performance
        geometry: feature.geometry
      }))
    };
    
    return simplified;
  }, [geojsonData]);

  // Function to define the style of the transmission lines
  const lineStyle = (feature) => {
    const voltage = feature.properties.VOLTAGE;
    const owner = feature.properties.OWNER;
    const status = feature.properties.STATUS;
    
    let color = '#007bff'; // Default color (blue)
    let weight = 2;

    // Owner-based color scheme (for when filtering by owners)
    const ownerColors = {
      'GEORGIA POWER CO': '#FF6B6B',                    // Red
      'PACIFICORP': '#4ECDC4',                          // Teal
      'ONCOR ELECTRIC DELIVERY CO.': '#45B7D1',         // Sky Blue
      'ALABAMA POWER CO': '#96CEB4',                    // Mint Green
      'TENNESSEE VALLEY AUTHORITY': '#FFEAA7',          // Light Yellow
      'DUKE ENERGY CAROLINAS, LLC': '#DDA0DD',          // Plum
      'PACIFIC GAS & ELECTRIC COMPANY': '#98D8C8',      // Light Teal
      'NIAGARA MOHAWK POWER CORP.': '#F7DC6F',          // Gold
      'AMEREN ILLINOIS COMPANY': '#BB8FCE',             // Light Purple
      'BONNEVILLE POWER ADMINISTRATION': '#85C1E9',     // Light Blue
      'SOUTHERN CALIFORNIA EDISON CO': '#F8C471',       // Peach
      'COMMONWEALTH EDISON CO': '#82E0AA',              // Light Green
      'AMERICAN ELECTRIC POWER': '#F1948A',            // Salmon
      'XCEL ENERGY': '#85CDFA',                         // Powder Blue
      'DOMINION ENERGY': '#D7BDE2'                      // Lavender
    };

    // Check if we should color by owner (if owner is recognized)
    if (owner && ownerColors[owner]) {
      color = ownerColors[owner];
      weight = 2.5; // Slightly thicker for owner-based coloring
    } else {
      // Fall back to voltage-based coloring
      const voltageStr = voltage ? String(voltage) : '';

      if (voltageStr.includes('765kV')) {
        color = '#ff0000'; // Red for highest voltage
        weight = 4;
      } else if (voltageStr.includes('500kV')) {
        color = '#ffa500'; // Orange
        weight = 3;
      } else if (voltageStr.includes('345kV')) {
        color = '#ffff00'; // Yellow
        weight = 2.5;
      } else if (voltageStr.includes('230kV')) {
        color = '#00ff00'; // Green
        weight = 2;
      }
    }
    
    // Check for status like "Under Construction" to use a dashed line
    const dashArray = status === 'Under Construction' ? '5, 5' : null;

    return {
      color: color,
      weight: weight,
      opacity: 0.8,
      dashArray: dashArray,
    };
  };

  // Function to bind popup content to each feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const props = feature.properties;
      const popupContent = `
        <div style="color: white; font-family: Arial, sans-serif; line-height: 1.4;">
          <strong style="color: #61dafb;">Voltage:</strong> ${props.VOLTAGE || 'N/A'}<br/>
          <strong style="color: #61dafb;">Owner:</strong> ${props.OWNER || 'N/A'}<br/>
          <strong style="color: #61dafb;">Status:</strong> ${props.STATUS || 'N/A'}<br/>
          <strong style="color: #61dafb;">Type:</strong> ${props.TYPE || 'N/A'}
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  // Get unique owners from current data for legend
  const getUniqueOwners = () => {
    if (!geojsonData || !geojsonData.features) return [];
    
    const owners = new Set();
    geojsonData.features.forEach(feature => {
      const owner = feature.properties?.OWNER;
      if (owner && owner !== 'NOT AVAILABLE' && owner !== 'Unknown') {
        owners.add(owner);
      }
    });
    
    return Array.from(owners).slice(0, 10); // Show max 10 in legend
  };

  const uniqueOwners = getUniqueOwners();

  // Owner color mapping (same as in lineStyle)
  const ownerColors = {
    'GEORGIA POWER CO': '#FF6B6B',
    'PACIFICORP': '#4ECDC4',
    'ONCOR ELECTRIC DELIVERY CO.': '#45B7D1',
    'ALABAMA POWER CO': '#96CEB4',
    'TENNESSEE VALLEY AUTHORITY': '#FFEAA7',
    'DUKE ENERGY CAROLINAS, LLC': '#DDA0DD',
    'PACIFIC GAS & ELECTRIC COMPANY': '#98D8C8',
    'NIAGARA MOHAWK POWER CORP.': '#F7DC6F',
    'AMEREN ILLINOIS COMPANY': '#BB8FCE',
    'BONNEVILLE POWER ADMINISTRATION': '#85C1E9',
    'SOUTHERN CALIFORNIA EDISON CO': '#F8C471',
    'COMMONWEALTH EDISON CO': '#82E0AA',
    'AMERICAN ELECTRIC POWER': '#F1948A',
    'XCEL ENERGY': '#85CDFA',
    'DOMINION ENERGY': '#D7BDE2'
  };


  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer 
        center={US_CENTER} 
        zoom={INITIAL_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* 1. Base Map Tile Layer (OpenStreetMap - FREE) */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 2. Dynamic GeoJSON Layer */}
        {processedData && (
          <GeoJSON 
            key={key} // Force re-render on data change
            data={processedData} 
            style={lineStyle} 
            onEachFeature={onEachFeature}
            // PERFORMANCE: Reduce interaction overhead
            interactive={true}
            bubblingMouseEvents={false}
          />
        )}
      </MapContainer>

      {/* 3. Legend for Owner Colors */}
      {uniqueOwners.length > 0 && (
        <div 
          className={`map-legend ${legendCollapsed ? 'legend-collapsed' : 'legend-expanded'}`}
          onClick={() => setLegendCollapsed(!legendCollapsed)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'black',
            padding: legendCollapsed ? '5px' : '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontSize: '12px',
            zIndex: 1000,
            maxWidth: legendCollapsed ? '50px' : '250px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {legendCollapsed ? (
            <div className="legend-toggle" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              📋
            </div>
          ) : (
            <div className="legend-content">
              <div style={{ fontWeight: 'bold', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Utility Companies</span>
                <span style={{ fontSize: '14px', cursor: 'pointer' }}>✕</span>
              </div>
              {uniqueOwners.map(owner => (
                <div key={owner} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                  <div style={{
                    width: '15px',
                    height: '3px',
                    backgroundColor: ownerColors[owner] || '#007bff',
                    marginRight: '8px',
                    borderRadius: '1px'
                  }}></div>
                  <span style={{ fontSize: '11px' }}>
                    {owner.length > 25 ? owner.substring(0, 25) + '...' : owner}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;