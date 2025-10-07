import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';
import AdminDashboard from './AdminDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import RetailerDashboard from './RetailerDashboard';
import Dashboard from './Dashboard';

const RoleLanding: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="role-landing">
        <div className="welcome-section">
          <h1>Welcome to Crackers Bazaar</h1>
          <p>Your one-stop destination for premium crackers and fireworks</p>
          <div className="cta-buttons">
            <a href="/login" className="btn btn-primary">Login</a>
            <a href="/register" className="btn btn-secondary">Register</a>
          </div>
        </div>
      </div>
    );
  }

  // Show role-specific landing content
  switch (user.role) {
    case Role.ADMIN:
    case Role.DASHBOARD_ADMIN:
      return <AdminDashboard />;
    
    case Role.MANUFACTURER:
      return <ManufacturerDashboard />;
    
    case Role.RETAILER:
      return <RetailerDashboard />;
    
    default:
      return <Dashboard />;
  }
};

export default RoleLanding;
