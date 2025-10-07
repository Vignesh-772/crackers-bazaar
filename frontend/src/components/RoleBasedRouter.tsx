import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';
import AdminDashboard from './AdminDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import RetailerDashboard from './RetailerDashboard';
import Dashboard from './Dashboard';

const RoleBasedRouter: React.FC = () => {
  const { user } = useAuth();

  console.log('RoleBasedRouter - Current user:', user);

  if (!user) {
    console.log('RoleBasedRouter - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('RoleBasedRouter - User role:', user.role);

  // Route users to their role-specific dashboard
  switch (user.role) {
    case Role.ADMIN:
    case Role.DASHBOARD_ADMIN:
      console.log('RoleBasedRouter - Rendering AdminDashboard');
      return <AdminDashboard />;
    
    case Role.MANUFACTURER:
      console.log('RoleBasedRouter - Rendering ManufacturerDashboard');
      return <ManufacturerDashboard />;
    
    case Role.RETAILER:
      console.log('RoleBasedRouter - Rendering RetailerDashboard');
      return <RetailerDashboard />;
    
    default:
      console.log('RoleBasedRouter - Rendering default Dashboard');
      return <Dashboard />;
  }
};

export default RoleBasedRouter;
