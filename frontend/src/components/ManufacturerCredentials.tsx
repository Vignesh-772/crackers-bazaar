import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiManager } from '../services/ApiManager';
import { API_CONFIG } from '../config/api';
import './ManufacturerCredentials.css';

interface ManufacturerCredentialsProps {
  manufacturerEmail: string;
  onClose: () => void;
}

const ManufacturerCredentials: React.FC<ManufacturerCredentialsProps> = ({ 
  manufacturerEmail, 
  onClose 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
    email: string;
  } | null>(null);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  const checkAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiManager.get<{ hasAccount: boolean }>(
        `${API_CONFIG.ENDPOINTS.MANUFACTURER_USERS.CHECK_ACCOUNT}?email=${encodeURIComponent(manufacturerEmail)}`
      );

      if (response.success && response.data) {
        setHasAccount(response.data.hasAccount);
      } else {
        throw new Error(response.error || 'Failed to check account status');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiManager.post<{
        username: string;
        newPassword: string;
        email: string;
      }>(
        API_CONFIG.ENDPOINTS.MANUFACTURER_USERS.RESET_PASSWORD,
        { email: manufacturerEmail }
      );

      if (response.success && response.data) {
        setCredentials({
          username: response.data.username || 'Check console logs',
          password: response.data.newPassword,
          email: response.data.email
        });
      } else {
        throw new Error(response.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="manufacturer-credentials">
      <div className="credentials-modal">
        <div className="modal-header">
          <h3>Manufacturer Login Credentials</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="modal-body">
          <div className="manufacturer-info">
            <p><strong>Manufacturer Email:</strong> {manufacturerEmail}</p>
          </div>

          <div className="account-status">
            <h4>Account Status</h4>
            {hasAccount === null ? (
              <button onClick={checkAccount} className="btn btn-primary" disabled={loading}>
                {loading ? 'Checking...' : 'Check Account Status'}
              </button>
            ) : (
              <div className={`status-badge ${hasAccount ? 'has-account' : 'no-account'}`}>
                {hasAccount ? 'User Account Exists' : 'No User Account'}
              </div>
            )}
          </div>

          {hasAccount && (
            <div className="password-reset">
              <h4>Reset Password</h4>
              <p>Generate a new temporary password for the manufacturer.</p>
              <button onClick={resetPassword} className="btn btn-warning" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}

          {credentials && (
            <div className="credentials-display">
              <h4>Login Credentials</h4>
              <div className="credential-item">
                <label>Username:</label>
                <div className="credential-value">
                  <span>{credentials.username || 'Check console logs'}</span>
                  <button onClick={() => copyToClipboard(credentials.username || '')} className="copy-btn">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="credential-item">
                <label>Password:</label>
                <div className="credential-value">
                  <span className="password-text">{credentials.password}</span>
                  <button onClick={() => copyToClipboard(credentials.password)} className="copy-btn">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="credential-item">
                <label>Email:</label>
                <div className="credential-value">
                  <span>{credentials.email}</span>
                  <button onClick={() => copyToClipboard(credentials.email)} className="copy-btn">
                    Copy
                  </button>
                </div>
              </div>

              <div className="credentials-note">
                <p><strong>Important:</strong> Share these credentials with the manufacturer securely. 
                They should change their password after first login.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerCredentials;
