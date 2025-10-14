import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';
import ProductList from './ProductList';
import './RetailerDashboard.css';

const RetailerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const [currentView, setCurrentView] = useState<'dashboard' | 'products'>('dashboard');

  useEffect(() => {
    if (user && user.role === Role.RETAILER) {
      fetchRetailerStats();
    }
  }, [user]);

  const fetchRetailerStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalOrders: 18,
        pendingOrders: 2,
        completedOrders: 16,
        totalSpent: 25000
      });
    } catch (error) {
      console.error('Failed to fetch retailer stats:', error);
    }
  };

  if (!user || user.role !== Role.RETAILER) {
    return (
      <div className="retailer-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This dashboard is only available to retailers.</p>
        </div>
      </div>
    );
  }

  // Render products view
  if (currentView === 'products') {
    return (
      <div className="retailer-dashboard">
        <div className="dashboard-header">
          <h1>Browse Products</h1>
          <div className="header-actions">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="btn btn-secondary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <ProductList
          showActions={false}
          autoFetch={true}
          key="retailer-products"
        />
      </div>
    );
  }

  return (
    <div className="retailer-dashboard">
      <div className="dashboard-header">
        <h1>Retailer Dashboard</h1>
        <p>Welcome back, {user.firstName} {user.lastName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <div className="stat-number">{stats.totalOrders}</div>
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
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed Orders</h3>
            <div className="stat-number">{stats.completedOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Spent</h3>
            <div className="stat-number">₹{stats.totalSpent.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => setCurrentView('products')}
              className="btn btn-primary"
            >
              Browse Products
            </button>
            <button className="btn btn-secondary">
              View My Orders
            </button>
            <button className="btn btn-secondary">
              Track Orders
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
                <span className="order-items">3 items</span>
              </div>
              <div className="order-status pending">Pending</div>
              <div className="order-amount">₹2,500</div>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-id">#ORD-002</span>
                <span className="order-date">2024-01-14</span>
                <span className="order-items">5 items</span>
              </div>
              <div className="order-status completed">Completed</div>
              <div className="order-amount">₹1,800</div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">🎆</div>
              <div className="product-info">
                <h4>Premium Crackers</h4>
                <p className="product-price">₹500</p>
                <button className="btn btn-sm">Add to Cart</button>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">🎇</div>
              <div className="product-info">
                <h4>Sparklers Pack</h4>
                <p className="product-price">₹300</p>
                <button className="btn btn-sm">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Order History</h2>
          <div className="history-chart">
            <p>Chart showing your order history and spending patterns</p>
            <div className="chart-placeholder">
              📊 Order History Chart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
