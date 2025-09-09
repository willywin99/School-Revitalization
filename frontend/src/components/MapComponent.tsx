// frontend/src/components/MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { getProvinces, ProvinceData } from '../services/api';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import indonesiaGeoJSON from '../data/indonesia-provinces.json';

interface MapComponentProps {
  onProvinceSelect: (provinceId: string) => void;
  selectedProvince: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ onProvinceSelect, selectedProvince }) => {
  const [provincesData, setProvincesData] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProvinces();
        
        // Check if data has error property
        if (data && 'error' in data) {
          setError(data.error);
          return;
        }
        
        // Type guard to check if it's ProvinceData[]
        if (Array.isArray(data)) {
          setProvincesData(data);
        } else {
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching provinces data:', error);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const provinceCode = feature.properties.id;
    const provinceName = feature.properties.name;
    const data = provincesData.find(p => p.code === provinceCode);
    
    if (data) {
      layer.bindTooltip(`
        <div class="map-tooltip">
          <strong>${provinceName}</strong><br>
          Total Sekolah: ${data.total_schools.toLocaleString('id-ID')}<br>
          Total Anggaran: ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(data.total_budget)}
        </div>
      `);
    } else {
      layer.bindTooltip(`<div class="map-tooltip"><strong>${provinceName}</strong><br>Data tidak tersedia</div>`);
    }

    layer.on({
      click: () => {
        onProvinceSelect(provinceCode);
      }
    });
  };

  if (loading) {
    return <div className="map-loading">Loading map data...</div>;
  }

  if (error) {
    return (
      <div className="map-container">
        <h2>Peta Persebaran Revitalisasi Sekolah</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <h2>Peta Persebaran Revitalisasi Sekolah</h2>
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={indonesiaGeoJSON as any}
          onEachFeature={onEachFeature}
          style={(feature) => {
            const provinceCode = feature?.properties.id;
            const hasData = provincesData.some(p => p.code === provinceCode);
            
            return {
              fillColor: selectedProvince === provinceCode ? '#e74c3c' : 
                         hasData ? '#3498db' : '#bdc3c7',
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;