import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ApiStatus } from '../types/api';
import RoleQuickActions from './RoleQuickActions';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async (): Promise<void> => {
    try {
      const response = await axios.get('http://localhost:8080/api/health');
      setApiStatus({
        status: 'success',
        message: response.data.message,
        data: response.data
      });
    } catch (error: any) {
      setApiStatus({
        status: 'error',
        message: 'Backend API is not available. Make sure Spring Boot is running on port 8080.',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Crackers Bazaar</h1>
        <p>Your one-stop destination for premium fireworks and crackers</p>
        <a href="#features" className="btn">Explore Products</a>
      </div>

      <div className="api-status">
        <h3>Backend API Status</h3>
        {loading ? (
          <p>Checking API connection...</p>
        ) : (
          <div className={`api-status ${apiStatus?.status}`}>
            <p><strong>Status:</strong> {apiStatus?.status === 'success' ? '✅ Connected' : '❌ Disconnected'}</p>
            <p><strong>Message:</strong> {apiStatus?.message}</p>
            {apiStatus?.data && (
              <p><strong>Backend Response:</strong> {JSON.stringify(apiStatus.data)}</p>
            )}
          </div>
        )}
      </div>

      {user && <RoleQuickActions />}

      <div id="features" className="features">
        <div className="feature-card">
          <h3>🎆 Premium Quality</h3>
          <p>We offer only the highest quality fireworks and crackers, sourced from trusted manufacturers.</p>
        </div>
        <div className="feature-card">
          <h3>🚚 Fast Delivery</h3>
          <p>Quick and safe delivery to your doorstep with proper handling and packaging.</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ Safety First</h3>
          <p>All our products come with safety guidelines and proper usage instructions.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
