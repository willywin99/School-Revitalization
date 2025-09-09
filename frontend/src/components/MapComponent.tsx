// components/MapComponent.tsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import indonesiaGeoJSON from '../data/indonesia-provinces.json';

interface MapComponentProps {
  onProvinceSelect: (provinceId: string) => void;
  selectedProvince: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ onProvinceSelect, selectedProvince }) => {
  // This would normally come from API
  const provinceData = {
    "11": { name: "Aceh", revitalizations: { paud: 26, sd: 138, smp: 96, sma: 122 } },
    "51": { name: "Bali", revitalizations: { paud: 10, sd: 53, smp: 22, sma: 20 } },
    // More provinces would be added here
  };

  const onEachFeature = (feature: any, layer: any) => {
    const provinceCode = feature.properties.id;
    const provinceName = feature.properties.name;
    const data = provinceData[provinceCode as keyof typeof provinceData];
    
    if (data) {
      layer.bindTooltip(`
        <div class="map-tooltip">
          <strong>${provinceName}</strong><br>
          PAUD: ${data.revitalizations.paud} sekolah<br>
          SD: ${data.revitalizations.sd} sekolah<br>
          SMP: ${data.revitalizations.smp} sekolah<br>
          SMA: ${data.revitalizations.sma} sekolah
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
            return {
              fillColor: selectedProvince === provinceCode ? '#e74c3c' : '#3498db',
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