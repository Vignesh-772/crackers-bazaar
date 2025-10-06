import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types/user';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user && (user.role === Role.ADMIN || user.role === Role.DASHBOARD_ADMIN)) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/all');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: Role): string => {
    switch (role) {
      case Role.ADMIN:
        return 'Admin';
      case Role.DASHBOARD_ADMIN:
        return 'Dashboard Admin';
      case Role.MANUFACTURER:
        return 'Manufacturer';
      case Role.RETAILER:
        return 'Retailer';
      default:
        return role;
    }
  };

  const getRoleColor = (role: Role): string => {
    switch (role) {
      case Role.ADMIN:
        return 'role-admin';
      case Role.DASHBOARD_ADMIN:
        return 'role-dashboard-admin';
      case Role.MANUFACTURER:
        return 'role-manufacturer';
      case Role.RETAILER:
        return 'role-retailer';
      default:
        return '';
    }
  };

  if (!user) {
    return <div>Please login to access the dashboard.</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.firstName} {user.lastName}</h1>
        <div className="user-info">
          <span className={`role-badge ${getRoleColor(user.role)}`}>
            {getRoleDisplayName(user.role)}
          </span>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {getRoleDisplayName(user.role)}</p>
            <p><strong>Status:</strong> {user.active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>

        {(user.role === Role.ADMIN || user.role === Role.DASHBOARD_ADMIN) && (
          <div className="dashboard-card">
            <h2>User Management</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>
                          <span className={`role-badge ${getRoleColor(u.role)}`}>
                            {getRoleDisplayName(u.role)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.active ? 'active' : 'inactive'}`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {user.role === Role.DASHBOARD_ADMIN && (
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="btn btn-primary">
                Create Manufacturer
              </button>
              <button className="btn btn-primary">
                Create Retailer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

