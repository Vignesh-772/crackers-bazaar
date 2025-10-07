import React, { useState, useEffect } from 'react';
import { Manufacturer, ManufacturerStatus } from '../types/manufacturer';
import './ManufacturerList.css';

const ManufacturerList: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchManufacturers();
  }, [currentPage, statusFilter]);

  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/api/admin/manufacturers?page=${currentPage}&size=10`;
      
      if (statusFilter !== 'ALL') {
        url = `http://localhost:8080/api/admin/manufacturers/status/${statusFilter}?page=${currentPage}&size=10`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch manufacturers');
      }
      
      const data = await response.json();
      setManufacturers(data.content || data);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchManufacturers();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/manufacturers/search/company?companyName=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to search manufacturers');
      }
      
      const data = await response.json();
      setManufacturers(data);
      setTotalPages(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ManufacturerStatus) => {
    const statusClasses = {
      PENDING: 'status-pending',
      APPROVED: 'status-approved',
      REJECTED: 'status-rejected',
      SUSPENDED: 'status-suspended',
      ACTIVE: 'status-active',
      INACTIVE: 'status-inactive'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading manufacturers...</div>;
  }

  return (
    <div className="manufacturer-list">
      <div className="list-header">
        <h2>Manufacturers</h2>
        
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error">Error: {error}</div>
      )}

      <div className="manufacturer-grid">
        {manufacturers.map((manufacturer) => (
          <div key={manufacturer.id} className="manufacturer-card">
            <div className="card-header">
              <h3>{manufacturer.companyName}</h3>
              {getStatusBadge(manufacturer.status)}
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
                <strong>Verified:</strong> {manufacturer.verified ? 'Yes' : 'No'}
              </div>
              <div className="info-row">
                <strong>Created:</strong> {formatDate(manufacturer.createdAt)}
              </div>
              
              {manufacturer.verificationNotes && (
                <div className="info-row">
                  <strong>Notes:</strong> {manufacturer.verificationNotes}
                </div>
              )}
            </div>
            
            <div className="card-actions">
              <button className="btn-primary">View Details</button>
              <button className="btn-secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {manufacturers.length === 0 && !loading && (
        <div className="no-data">
          <p>No manufacturers found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManufacturerList;
