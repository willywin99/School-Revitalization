// frontend/src/components/NationalDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getNationalData, RevitalizationData } from '../services/api';
import './NationalDashboard.css';

const NationalDashboard: React.FC = () => {
  const [nationalData, setNationalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNationalData();
        console.log('API Response:', data); // Debug log
        
        // Check if data has error property (API returned an error)
        if (data && 'error' in data) {
          setError(data.error);
          return;
        }

        // Check if data is in the expected format
        if (Array.isArray(data)) {
          // Convert string values to numbers before calculations
          const numericData = data.map(item => ({
            ...item,
            total_schools: typeof item.total_schools === 'string' 
              ? parseInt(item.total_schools) || 0 
              : item.total_schools || 0,
            total_budget: typeof item.total_budget === 'string'
              ? parseInt(item.total_budget) || 0
              : item.total_budget || 0,
            school_count: typeof item.school_count === 'string'
              ? parseInt(item.school_count) || 0
              : item.school_count || 0,
            budget: typeof item.budget === 'string'
              ? parseInt(item.budget) || 0
              : item.budget || 0
          }));

          const transformedData = {
            totalRevitalizations: numericData.reduce((sum: number, item: RevitalizationData) => 
              sum + (item.total_schools || item.school_count || 0), 0),
            totalBudget: numericData.reduce((sum: number, item: RevitalizationData) => 
              sum + (item.total_budget || item.budget || 0), 0),
            byLevel: {
              paud: {
                count: numericData.find((item: RevitalizationData) => item.education_level === 'paud')?.total_schools || 
                       numericData.find((item: RevitalizationData) => item.education_level === 'paud')?.school_count || 0,
                budget: numericData.find((item: RevitalizationData) => item.education_level === 'paud')?.total_budget || 
                        numericData.find((item: RevitalizationData) => item.education_level === 'paud')?.budget || 0
              },
              sd: {
                count: numericData.find((item: RevitalizationData) => item.education_level === 'sd')?.total_schools || 
                       numericData.find((item: RevitalizationData) => item.education_level === 'sd')?.school_count || 0,
                budget: numericData.find((item: RevitalizationData) => item.education_level === 'sd')?.total_budget || 
                        numericData.find((item: RevitalizationData) => item.education_level === 'sd')?.budget || 0
              },
              smp: {
                count: numericData.find((item: RevitalizationData) => item.education_level === 'smp')?.total_schools || 
                       numericData.find((item: RevitalizationData) => item.education_level === 'smp')?.school_count || 0,
                budget: numericData.find((item: RevitalizationData) => item.education_level === 'smp')?.total_budget || 
                        numericData.find((item: RevitalizationData) => item.education_level === 'smp')?.budget || 0
              },
              sma: {
                count: numericData.find((item: RevitalizationData) => item.education_level === 'sma')?.total_schools || 
                       numericData.find((item: RevitalizationData) => item.education_level === 'sma')?.school_count || 0,
                budget: numericData.find((item: RevitalizationData) => item.education_level === 'sma')?.total_budget || 
                        numericData.find((item: RevitalizationData) => item.education_level === 'sma')?.budget || 0
              }
            }
          };
          
          console.log('Transformed data:', transformedData); // Debug log
          setNationalData(transformedData);
        } else {
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching national data:', error);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  if (error) {
    return (
      <div className="national-dashboard">
        <h2>Data Nasional Revitalisasi Sekolah</h2>
        <div className="error">
          <p>Error: {error}</p>
          <p>Please check if the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  if (!nationalData) {
    return (
      <div className="national-dashboard">
        <h2>Data Nasional Revitalisasi Sekolah</h2>
        <div className="error">No data available</div>
      </div>
    );
  }

  // Calculate the correct total (sum of all school counts)
  const correctTotal = nationalData.byLevel.paud.count + 
                      nationalData.byLevel.sd.count + 
                      nationalData.byLevel.smp.count + 
                      nationalData.byLevel.sma.count;

  return (
    <div className="national-dashboard">
      <h2>Data Nasional Revitalisasi Sekolah</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Revitalisasi Sekolah</h3>
          <p className="big-number">{correctTotal.toLocaleString('id-ID')}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Anggaran Revitalisasi</h3>
          <p className="big-number">{formatCurrency(nationalData.totalBudget)}</p>
        </div>
      </div>

      <div className="breakdown">
        <h3>Breakdown per Jenjang Pendidikan</h3>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <h4>PAUD</h4>
            <p>Sekolah: {nationalData.byLevel.paud.count.toLocaleString('id-ID')}</p>
            <p>Anggaran: {formatCurrency(nationalData.byLevel.paud.budget)}</p>
          </div>
          
          <div className="breakdown-item">
            <h4>SD</h4>
            <p>Sekolah: {nationalData.byLevel.sd.count.toLocaleString('id-ID')}</p>
            <p>Anggaran: {formatCurrency(nationalData.byLevel.sd.budget)}</p>
          </div>
          
          <div className="breakdown-item">
            <h4>SMP</h4>
            <p>Sekolah: {nationalData.byLevel.smp.count.toLocaleString('id-ID')}</p>
            <p>Anggaran: {formatCurrency(nationalData.byLevel.smp.budget)}</p>
          </div>
          
          <div className="breakdown-item">
            <h4>SMA</h4>
            <p>Sekolah: {nationalData.byLevel.sma.count.toLocaleString('id-ID')}</p>
            <p>Anggaran: {formatCurrency(nationalData.byLevel.sma.budget)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalDashboard;