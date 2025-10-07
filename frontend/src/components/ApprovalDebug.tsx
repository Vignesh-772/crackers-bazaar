import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Manufacturer } from '../types/manufacturer';

const ApprovalDebug: React.FC = () => {
  const { user } = useAuth();
  const [allManufacturers, setAllManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllManufacturers();
  }, []);

  const fetchAllManufacturers = async () => {
    setLoading(true);
    try {
      console.log('Fetching all manufacturers for debug...');
      const response = await fetch('http://localhost:8080/api/admin/manufacturers?page=0&size=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('All manufacturers response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching all manufacturers:', errorData);
        throw new Error('Failed to fetch manufacturers');
      }
      
      const data = await response.json();
      console.log('All manufacturers data:', data);
      
      // Handle both paginated and non-paginated responses
      const manufacturers = data.content || data;
      setAllManufacturers(manufacturers);
    } catch (err: any) {
      console.error('Error in fetchAllManufacturers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestManufacturer = async () => {
    setLoading(true);
    try {
      const testManufacturer = {
        companyName: 'Test Company ' + Date.now(),
        contactPerson: 'Test Contact',
        email: `test${Date.now()}@example.com`,
        phoneNumber: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'Test Country'
      };

      console.log('Creating test manufacturer:', testManufacturer);
      
      const response = await fetch('http://localhost:8080/api/admin/manufacturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testManufacturer)
      });

      console.log('Create test manufacturer response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating test manufacturer:', errorData);
        throw new Error(errorData.error || 'Failed to create test manufacturer');
      }

      const responseData = await response.json();
      console.log('Test manufacturer created successfully:', responseData);

      // Refresh the list
      await fetchAllManufacturers();
    } catch (err: any) {
      console.error('Error creating test manufacturer:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'DASHBOARD_ADMIN')) {
    return (
      <div className="approval-debug">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This debug component is only available to admins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="approval-debug">
      <h2>Approval Debug</h2>
      
      <div className="debug-actions">
        <button onClick={fetchAllManufacturers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh All Manufacturers'}
        </button>
        <button onClick={createTestManufacturer} disabled={loading}>
          {loading ? 'Creating...' : 'Create Test Manufacturer'}
        </button>
      </div>

      {error && (
        <div className="error">Error: {error}</div>
      )}

      <div className="manufacturers-list">
        <h3>All Manufacturers ({allManufacturers.length})</h3>
        {allManufacturers.map((manufacturer) => (
          <div key={manufacturer.id} className="manufacturer-item">
            <div className="manufacturer-info">
              <h4>{manufacturer.companyName}</h4>
              <p>Contact: {manufacturer.contactPerson}</p>
              <p>Email: {manufacturer.email}</p>
              <p>Status: <span className={`status ${manufacturer.status.toLowerCase()}`}>{manufacturer.status}</span></p>
              <p>Verified: {manufacturer.verified ? 'Yes' : 'No'}</p>
              {manufacturer.verificationNotes && (
                <p>Notes: {manufacturer.verificationNotes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalDebug;
