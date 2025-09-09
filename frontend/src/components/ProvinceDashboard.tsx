// frontend/src/components/ProvinceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getProvinceData, DistrictData } from '../services/api';
import './ProvinceDashboard.css';

interface ProvinceDashboardProps {
  provinceId: string;
  onDistrictSelect: (districtId: string) => void;
}

const ProvinceDashboard: React.FC<ProvinceDashboardProps> = ({ provinceId, onDistrictSelect }) => {
  const [provinceData, setProvinceData] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProvinceData(provinceId);
        
        // Check if data has error property
        if (data && 'error' in data) {
          setError(data.error);
          return;
        }
        
        // Type guard to check if it's DistrictData[]
        if (Array.isArray(data)) {
          setProvinceData(data);
          if (data.length > 0) {
            setProvinceName(data[0].province_name);
          }
        } else {
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching province data:', error);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [provinceId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading province data...</div>;
  }

  if (error) {
    return (
      <div className="province-dashboard">
        <h2>Data Revitalisasi Sekolah</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Get unique districts
  const uniqueDistricts = provinceData.filter((value, index, self) => 
    index === self.findIndex((d) => d.district_name === value.district_name)
  );

  return (
    <div className="province-dashboard">
      <h2>Data Revitalisasi Sekolah - {provinceName}</h2>
      
      <div className="district-list">
        <h3>Daftar Kabupaten/Kota</h3>
        {uniqueDistricts.map((district, index) => (
          <div 
            key={index} 
            className="district-item"
            onClick={() => onDistrictSelect(district.district_id?.toString() || index.toString())}
          >
            <h4>{district.district_name}</h4>
            <p>Klik untuk melihat detail</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvinceDashboard;