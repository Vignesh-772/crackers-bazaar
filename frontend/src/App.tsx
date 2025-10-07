import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { Role } from './types/user';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import RetailerDashboard from './components/RetailerDashboard';
import RoleBasedRouter from './components/RoleBasedRouter';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRouter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRoles={[Role.ADMIN, Role.DASHBOARD_ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manufacturer" 
                element={
                  <ProtectedRoute requiredRoles={[Role.MANUFACTURER]}>
                    <ManufacturerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/retailer" 
                element={
                  <ProtectedRoute requiredRoles={[Role.RETAILER]}>
                    <RetailerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;