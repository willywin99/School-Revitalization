// components/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>Dashboard Revitalisasi Sekolah Nasional</h1>
      <p>Monitor program revitalisasi sekolah PAUD, SD, SMP, dan SMA seluruh Indonesia</p>
    </header>
  );
};

export default Header;