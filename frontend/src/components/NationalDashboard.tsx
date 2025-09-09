// components/NationalDashboard.tsx
import React from 'react';
import './NationalDashboard.css';

const NationalDashboard: React.FC = () => {
  // This would normally come from API
  const nationalData = {
    totalRevitalizations: 8980,
    totalBudget: 8316121095256,
    byLevel: {
      paud: { count: 866, budget: 330409135700 },
      sd: { count: 3901, budget: 2565969815110 },
      smp: { count: 2295, budget: 3208266905543 },
      sma: { count: 1918, budget: 2211475238903 }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="national-dashboard">
      <h2>Data Nasional Revitalisasi Sekolah</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Revitalisasi Sekolah</h3>
          <p className="big-number">{nationalData.totalRevitalizations.toLocaleString('id-ID')}</p>
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