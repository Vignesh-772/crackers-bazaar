import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/user';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  const login = async (credentials: LoginRequest): Promise<string> => {
    setLoading(true);
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      const { token: newToken, ...userData } = response.data;
      
      console.log('Login response received:', userData);
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      // Return redirect path for navigation
      const redirectPath = getRedirectPath(userData.role);
      console.log('Redirect path determined:', redirectPath);
      return redirectPath;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (role: string): string => {
    console.log('getRedirectPath - Role received:', role);
    switch (role) {
      case 'ADMIN':
      case 'DASHBOARD_ADMIN':
        console.log('getRedirectPath - Returning /admin');
        return '/admin';
      case 'MANUFACTURER':
        console.log('getRedirectPath - Returning /manufacturer');
        return '/manufacturer';
      case 'RETAILER':
        console.log('getRedirectPath - Returning /retailer');
        return '/retailer';
      default:
        console.log('getRedirectPath - Returning /dashboard (default)');
        return '/dashboard';
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

