import React, { useState } from 'react';
import { ManufacturerRequest } from '../types/manufacturer';
import { ManufacturerApiService } from '../services/ManufacturerService';
import './ManufacturerForm.css';

interface ManufacturerFormProps {
  onSuccess: () => void;
}

const ManufacturerForm: React.FC<ManufacturerFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ManufacturerRequest>({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    gstNumber: '',
    panNumber: '',
    licenseNumber: '',
    licenseValidity: '',
    // User credentials
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Creating manufacturer with data:', formData);
      
      const responseData = await ManufacturerApiService.createManufacturer(formData);
      console.log('Manufacturer created successfully:', responseData);

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="manufacturer-form">
        <div className="success-message">
          <h2>Manufacturer Created Successfully!</h2>
          <p>The manufacturer has been added to the system and can now login.</p>
          <div className="credentials-info">
            <h3>Login Credentials:</h3>
            <p><strong>Username:</strong> {formData.username}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Status:</strong> Pending Admin Approval</p>
            <p className="note">The manufacturer can login but will need admin approval to access all features.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manufacturer-form">
      <div className="form-header">
        <h2>Add New Manufacturer</h2>
        <p>Fill in the details to onboard a new manufacturer</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Company Information</h3>
          
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPerson">Contact Person *</label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              placeholder="Enter contact person name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              maxLength={10}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Address Information</h3>
          
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter complete address"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pincode">Pincode *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit pincode"
                pattern="[0-9]{6}"
                maxLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Login Credentials</h3>
          
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username for login"
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password (min 6 characters)"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              minLength={6}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Business Information (Optional)</h3>
          
          <div className="form-group">
            <label htmlFor="gstNumber">GST Number</label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="panNumber">PAN Number</label>
            <input
              type="text"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="Enter PAN number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">License Number</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter license number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseValidity">License Validity</label>
            <input
              type="datetime-local"
              id="licenseValidity"
              name="licenseValidity"
              value={formData.licenseValidity}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Manufacturer'}
          </button>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManufacturerForm;
