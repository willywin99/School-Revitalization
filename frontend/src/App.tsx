// App.tsx
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import NationalDashboard from './components/NationalDashboard';
import ProvinceDashboard from './components/ProvinceDashboard';
import DistrictDashboard from './components/DistrictDashboard';

export interface RevitalizationData {
  paud: { count: number; budget: number };
  sd: { count: number; budget: number };
  smp: { count: number; budget: number };
  sma: { count: number; budget: number };
}

export interface District {
  id: string;
  name: string;
  revitalizations: RevitalizationData;
}

export interface Province {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number][];
  districts: District[];
  revitalizations: RevitalizationData;
}

function App() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  return (
    <div className="App">
      <Header />
      <div className="dashboard-container">
        {!selectedProvince ? (
          <NationalDashboard />
        ) : !selectedDistrict ? (
          <ProvinceDashboard 
            provinceId={selectedProvince} 
            onDistrictSelect={setSelectedDistrict}
          />
        ) : (
          <DistrictDashboard 
            districtId={selectedDistrict}
            onBack={() => setSelectedDistrict(null)}
          />
        )}
      </div>
      <MapComponent 
        onProvinceSelect={setSelectedProvince}
        selectedProvince={selectedProvince}
      />
    </div>
  );
}

export default App;