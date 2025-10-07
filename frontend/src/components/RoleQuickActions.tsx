import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';
import './RoleQuickActions.css';

const RoleQuickActions: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleActions = () => {
    switch (user.role) {
      case Role.ADMIN:
      case Role.DASHBOARD_ADMIN:
        return (
          <div className="quick-actions admin-actions">
            <h3>Admin Actions</h3>
            <div className="action-grid">
              <Link to="/admin" className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-content">
                  <h4>Manage Manufacturers</h4>
                  <p>Onboard and verify manufacturers</p>
                </div>
              </Link>
              <Link to="/admin" className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h4>Dashboard Analytics</h4>
                  <p>View system statistics</p>
                </div>
              </Link>
              <Link to="/admin" className="action-card">
                <div className="action-icon">✅</div>
                <div className="action-content">
                  <h4>Pending Approvals</h4>
                  <p>Review manufacturer applications</p>
                </div>
              </Link>
            </div>
          </div>
        );

      case Role.MANUFACTURER:
        return (
          <div className="quick-actions manufacturer-actions">
            <h3>Manufacturer Actions</h3>
            <div className="action-grid">
              <Link to="/manufacturer" className="action-card">
                <div className="action-icon">📦</div>
                <div className="action-content">
                  <h4>My Products</h4>
                  <p>Manage your product catalog</p>
                </div>
              </Link>
              <Link to="/manufacturer" className="action-card">
                <div className="action-icon">🛒</div>
                <div className="action-content">
                  <h4>Orders</h4>
                  <p>View and manage orders</p>
                </div>
              </Link>
              <Link to="/manufacturer" className="action-card">
                <div className="action-icon">📈</div>
                <div className="action-content">
                  <h4>Analytics</h4>
                  <p>Track your performance</p>
                </div>
              </Link>
            </div>
          </div>
        );

      case Role.RETAILER:
        return (
          <div className="quick-actions retailer-actions">
            <h3>Retailer Actions</h3>
            <div className="action-grid">
              <Link to="/retailer" className="action-card">
                <div className="action-icon">🛍️</div>
                <div className="action-content">
                  <h4>Browse Products</h4>
                  <p>Explore available crackers</p>
                </div>
              </Link>
              <Link to="/retailer" className="action-card">
                <div className="action-icon">🛒</div>
                <div className="action-content">
                  <h4>My Orders</h4>
                  <p>Track your purchases</p>
                </div>
              </Link>
              <Link to="/retailer" className="action-card">
                <div className="action-icon">💳</div>
                <div className="action-content">
                  <h4>Payment</h4>
                  <p>Manage payment methods</p>
                </div>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return getRoleActions();
};

export default RoleQuickActions;
