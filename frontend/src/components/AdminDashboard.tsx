import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Manufacturer, ManufacturerStatus, DashboardStats } from '../types/manufacturer';
import ManufacturerList from './ManufacturerList';
import ManufacturerForm from './ManufacturerForm';
import ManufacturerVerification from './ManufacturerVerification';
import ApprovalDebug from './ApprovalDebug';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'DASHBOARD_ADMIN')) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'DASHBOARD_ADMIN')) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.firstName} {user.lastName}</p>
      </div>

      <div className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'manufacturers' ? 'active' : ''}
          onClick={() => setActiveTab('manufacturers')}
        >
          Manufacturers
        </button>
        <button 
          className={activeTab === 'add-manufacturer' ? 'active' : ''}
          onClick={() => setActiveTab('add-manufacturer')}
        >
          Add Manufacturer
        </button>
        <button 
          className={activeTab === 'pending-approvals' ? 'active' : ''}
          onClick={() => setActiveTab('pending-approvals')}
        >
          Pending Approvals
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-stats">
            <h2>Dashboard Statistics</h2>
            {loading ? (
              <div className="loading">Loading statistics...</div>
            ) : error ? (
              <div className="error">Error: {error}</div>
            ) : stats ? (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Pending</h3>
                  <div className="stat-number">{stats.pendingCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Approved</h3>
                  <div className="stat-number">{stats.approvedCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Rejected</h3>
                  <div className="stat-number">{stats.rejectedCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Active</h3>
                  <div className="stat-number">{stats.activeCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Suspended</h3>
                  <div className="stat-number">{stats.suspendedCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Inactive</h3>
                  <div className="stat-number">{stats.inactiveCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Verified</h3>
                  <div className="stat-number">{stats.verifiedCount}</div>
                </div>
                <div className="stat-card">
                  <h3>Unverified</h3>
                  <div className="stat-number">{stats.unverifiedCount}</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'manufacturers' && (
          <ManufacturerList />
        )}

        {activeTab === 'add-manufacturer' && (
          <ManufacturerForm onSuccess={() => setActiveTab('manufacturers')} />
        )}

        {activeTab === 'pending-approvals' && (
          <ManufacturerVerification />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
