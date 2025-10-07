import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';
import './ManufacturerDashboard.css';

const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === Role.MANUFACTURER) {
      fetchManufacturerStats();
    }
  }, [user]);

  const fetchManufacturerStats = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalProducts: 25,
        activeOrders: 12,
        pendingOrders: 3,
        totalRevenue: 45000
      });
    } catch (error) {
      console.error('Failed to fetch manufacturer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== Role.MANUFACTURER) {
    return (
      <div className="manufacturer-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This dashboard is only available to manufacturers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manufacturer-dashboard">
      <div className="dashboard-header">
        <h1>Manufacturer Dashboard</h1>
        <p>Welcome back, {user.firstName} {user.lastName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <div className="stat-number">{stats.totalProducts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Active Orders</h3>
            <div className="stat-number">{stats.activeOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <div className="stat-number">{stats.pendingOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <div className="stat-number">₹{stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-primary">
              Add New Product
            </button>
            <button className="btn btn-secondary">
              View All Products
            </button>
            <button className="btn btn-secondary">
              Manage Orders
            </button>
          </div>
        </div>

        <div className="content-section">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            <div className="order-item">
              <div className="order-info">
                <span className="order-id">#ORD-001</span>
                <span className="order-date">2024-01-15</span>
              </div>
              <div className="order-status pending">Pending</div>
              <div className="order-amount">₹2,500</div>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-id">#ORD-002</span>
                <span className="order-date">2024-01-14</span>
              </div>
              <div className="order-status active">Active</div>
              <div className="order-amount">₹1,800</div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Product Performance</h2>
          <div className="performance-chart">
            <p>Chart showing product sales performance over time</p>
            <div className="chart-placeholder">
              📊 Performance Chart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
