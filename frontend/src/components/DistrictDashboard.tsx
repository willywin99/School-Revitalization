// frontend/src/components/DistrictDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getDistrictData, DistrictData } from '../services/api';
import './DistrictDashboard.css';

interface DistrictDashboardProps {
  districtId: string;
  onBack: () => void;
}

interface DistrictDetail {
  district_name: string;
  province_name: string;
  education_level: string;
  school_count: number;
  budget: number;
}

const DistrictDashboard: React.FC<DistrictDashboardProps> = ({ districtId, onBack }) => {
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDistrictData(districtId);
        
        // Check if data has error property
        if (data && 'error' in data) {
          setError(data.error);
          return;
        }
        
        // Type guard to check if it's DistrictData[]
        if (Array.isArray(data)) {
          setDistrictData(data);
        } else {
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [districtId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading district data...</div>;
  }

  if (error) {
    return (
      <div className="district-dashboard">
        <button onClick={onBack} className="back-button">← Kembali</button>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (districtData.length === 0) {
    return (
      <div className="district-dashboard">
        <button onClick={onBack} className="back-button">← Kembali</button>
        <div className="error">Data tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="district-dashboard">
      <button onClick={onBack} className="back-button">← Kembali</button>
      
      <h2>Data Revitalisasi Sekolah - {districtData[0].district_name}</h2>
      <p>Provinsi: {districtData[0].province_name}</p>
      
      <div className="district-details">
        <h3>Detail per Jenjang Pendidikan</h3>
        <div className="detail-grid">
          {districtData.map((item) => (
            <div key={item.education_level} className="detail-item">
              <h4>{item.education_level.toUpperCase()}</h4>
              <p>Jumlah Sekolah: {item.school_count}</p>
              <p>Anggaran: {formatCurrency(item.budget)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;