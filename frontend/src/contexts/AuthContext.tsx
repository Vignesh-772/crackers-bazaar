import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/user';
import { AuthService } from '../services/AuthService';

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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = AuthService.getCurrentUser();
      const storedToken = AuthService.getToken();
      
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
        AuthService.initializeAuth();
      }
      
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<string> => {
    setLoading(true);
    try {
      console.log('Attempting login with credentials:', credentials);
      const userData = await AuthService.login(credentials);
      
      console.log('Login response received:', userData);
      
      setToken(userData.token);
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        active: true, // Default to active for logged in users
        createdAt: new Date().toISOString(), // Use current time as fallback
        updatedAt: new Date().toISOString() // Use current time as fallback
      });
      
      // Return redirect path for navigation
      const redirectPath = getRedirectPath(userData.role);
      console.log('Redirect path determined:', redirectPath);
      return redirectPath;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
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
      await AuthService.register(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  // Show loading while initializing auth state
  if (!initialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

