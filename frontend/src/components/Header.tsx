import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBasedNavigation = () => {
    if (!user) {
      return (
        <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </>
      );
    }

    const baseNavigation = [
      <li key="dashboard">
        <Link to="/dashboard">Dashboard</Link>
      </li>
    ];

    // Admin and Dashboard Admin navigation
    if (user.role === Role.ADMIN || user.role === Role.DASHBOARD_ADMIN) {
      baseNavigation.push(
        <li key="admin">
          <Link to="/admin">Admin Panel</Link>
        </li>
      );
    }

    // Manufacturer navigation
    if (user.role === Role.MANUFACTURER) {
      baseNavigation.push(
        <li key="products">
          <Link to="/manufacturer/products">My Products</Link>
        </li>,
        <li key="orders">
          <Link to="/manufacturer/orders">Orders</Link>
        </li>
      );
    }

    // Retailer navigation
    if (user.role === Role.RETAILER) {
      baseNavigation.push(
        <li key="catalog">
          <Link to="/retailer/catalog">Product Catalog</Link>
        </li>,
        <li key="orders">
          <Link to="/retailer/orders">My Orders</Link>
        </li>
      );
    }

    // User info and logout
    baseNavigation.push(
      <li key="user-info">
        <span className="user-welcome">
          Welcome, {user.firstName} ({user.role})
        </span>
      </li>,
      <li key="logout">
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </li>
    );

    return baseNavigation;
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          🎆 Crackers Bazaar
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {getRoleBasedNavigation()}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
