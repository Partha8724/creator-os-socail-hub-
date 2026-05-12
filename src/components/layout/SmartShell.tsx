import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SmartShell() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: '40px'
      }}
    >
      <h1>SmartShell Working ✅</h1>

      <div style={{ marginTop: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}
