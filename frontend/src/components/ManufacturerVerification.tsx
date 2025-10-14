import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Manufacturer, ManufacturerStatus } from '../types/manufacturer';
import { ManufacturerApiService } from '../services/ManufacturerService';
import ManufacturerCredentials from './ManufacturerCredentials';
import './ManufacturerVerification.css';

const ManufacturerVerification: React.FC = () => {
  const { user } = useAuth();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [verificationData, setVerificationData] = useState({
    status: ManufacturerStatus.APPROVED,
    verificationNotes: ''
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedManufacturerEmail, setSelectedManufacturerEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingManufacturers();
  }, []);

  const fetchPendingManufacturers = async () => {
    setLoading(true);
    try {
      console.log('Fetching pending manufacturers...');
      const data = await ManufacturerApiService.getPendingApprovals();
      console.log('Pending manufacturers data:', data);
      setManufacturers(data);
    } catch (err: any) {
      console.error('Error in fetchPendingManufacturers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowCredentials = (email: string) => {
    setSelectedManufacturerEmail(email);
    setShowCredentials(true);
  };

  const handleCloseCredentials = () => {
    setShowCredentials(false);
    setSelectedManufacturerEmail(null);
  };

  const handleVerification = async () => {
    if (!selectedManufacturer) return;
    
    console.log('Starting verification process...');
    console.log('Selected manufacturer:', selectedManufacturer);
    console.log('Verification data:', verificationData);
    console.log('Current user:', user);
    console.log('Admin ID:', user?.id);
    
    setLoading(true);
    try {
      const responseData = await ManufacturerApiService.verifyManufacturer(
        selectedManufacturer.id,
        verificationData,
        user?.id || 0
      );
      console.log('Success response:', responseData);

      // Refresh the list
      await fetchPendingManufacturers();
      setSelectedManufacturer(null);
      setVerificationData({
        status: ManufacturerStatus.APPROVED,
        verificationNotes: ''
      });
      
      console.log('Verification completed successfully');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && manufacturers.length === 0) {
    return <div className="loading">Loading pending manufacturers...</div>;
  }

  return (
    <div className="manufacturer-verification">
      <div className="verification-header">
        <h2>Manufacturer Verification</h2>
        <p>Review and approve pending manufacturer applications</p>
      </div>

      {error && (
        <div className="error">Error: {error}</div>
      )}

      <div className="verification-content">
        <div className="manufacturer-list">
          <h3>Pending Approvals ({manufacturers.length})</h3>
          
          {manufacturers.length === 0 ? (
            <div className="no-pending">
              <p>No pending manufacturer approvals.</p>
            </div>
          ) : (
            <div className="manufacturer-cards">
              {manufacturers.map((manufacturer) => (
                <div 
                  key={manufacturer.id} 
                  className={`manufacturer-card ${selectedManufacturer?.id === manufacturer.id ? 'selected' : ''}`}
                  onClick={() => setSelectedManufacturer(manufacturer)}
                >
                  <div className="card-header">
                    <h4>{manufacturer.companyName}</h4>
                    <span className="status-badge pending">PENDING</span>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-row">
                      <strong>Contact:</strong> {manufacturer.contactPerson}
                    </div>
                    <div className="info-row">
                      <strong>Email:</strong> {manufacturer.email}
                    </div>
                    <div className="info-row">
                      <strong>Phone:</strong> {manufacturer.phoneNumber}
                    </div>
                    <div className="info-row">
                      <strong>Location:</strong> {manufacturer.city}, {manufacturer.state}
                    </div>
                    <div className="info-row">
                      <strong>Applied:</strong> {formatDate(manufacturer.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedManufacturer && (
          <div className="verification-panel">
            <h3>Verify Manufacturer</h3>
            
            <div className="manufacturer-details">
              <h4>{selectedManufacturer.companyName}</h4>
              
              <div className="detail-section">
                <h5>Company Information</h5>
                <div className="detail-grid">
                  <div><strong>Contact Person:</strong> {selectedManufacturer.contactPerson}</div>
                  <div><strong>Email:</strong> {selectedManufacturer.email}</div>
                  <div><strong>Phone:</strong> {selectedManufacturer.phoneNumber}</div>
                </div>
              </div>

              <div className="detail-section">
                <h5>Address</h5>
                <div className="address-details">
                  <div>{selectedManufacturer.address}</div>
                  <div>{selectedManufacturer.city}, {selectedManufacturer.state}</div>
                  <div>{selectedManufacturer.pincode}, {selectedManufacturer.country}</div>
                </div>
              </div>

              {(selectedManufacturer.gstNumber || selectedManufacturer.panNumber || selectedManufacturer.licenseNumber) && (
                <div className="detail-section">
                  <h5>Business Information</h5>
                  <div className="detail-grid">
                    {selectedManufacturer.gstNumber && <div><strong>GST:</strong> {selectedManufacturer.gstNumber}</div>}
                    {selectedManufacturer.panNumber && <div><strong>PAN:</strong> {selectedManufacturer.panNumber}</div>}
                    {selectedManufacturer.licenseNumber && <div><strong>License:</strong> {selectedManufacturer.licenseNumber}</div>}
                    {selectedManufacturer.licenseValidity && <div><strong>License Valid Until:</strong> {formatDate(selectedManufacturer.licenseValidity)}</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="verification-form">
              <div className="form-group">
                <label htmlFor="status">Verification Status</label>
                <select
                  id="status"
                  value={verificationData.status}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    status: e.target.value as ManufacturerStatus
                  }))}
                >
                  <option value={ManufacturerStatus.APPROVED}>Approve</option>
                  <option value={ManufacturerStatus.REJECTED}>Reject</option>
                  <option value={ManufacturerStatus.SUSPENDED}>Suspend</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Verification Notes</label>
                <textarea
                  id="notes"
                  value={verificationData.verificationNotes}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    verificationNotes: e.target.value
                  }))}
                  placeholder="Add notes about the verification decision..."
                  rows={4}
                />
              </div>

              <div className="manufacturer-login-info">
                <h4>Login Information</h4>
                <div className="login-details">
                  <p><strong>Username:</strong> {selectedManufacturer.username || 'Not set'}</p>
                  <p><strong>Email:</strong> {selectedManufacturer.email}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${selectedManufacturer.status?.toLowerCase()}`}>
                      {selectedManufacturer.status}
                    </span>
                  </p>
                  <p className="login-note">
                    The manufacturer can login using their username and password. 
                    Their account will be activated/deactivated based on verification status.
                  </p>
                </div>
              </div>

              <div className="verification-actions">
                <button 
                  onClick={handleVerification} 
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Processing...' : 'Submit Verification'}
                </button>
                <button 
                  onClick={() => handleShowCredentials(selectedManufacturer.email)}
                  className="btn-info"
                >
                  View Login Credentials
                </button>
                <button 
                  onClick={() => setSelectedManufacturer(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showCredentials && selectedManufacturerEmail && (
        <ManufacturerCredentials
          manufacturerEmail={selectedManufacturerEmail}
          onClose={handleCloseCredentials}
        />
      )}
    </div>
  );
};

export default ManufacturerVerification;
