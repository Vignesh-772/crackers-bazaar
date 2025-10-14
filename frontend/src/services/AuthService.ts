import { apiManager } from './ApiManager';
import { API_CONFIG } from '../config/api';
import { LoginRequest, RegisterRequest, JwtResponse } from '../types/user';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await apiManager.post<JwtResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role
      }));
      
      // Set auth token in API manager
      apiManager.setAuthToken(response.data.token);
      
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  /**
   * Register user
   */
  static async register(userData: RegisterRequest): Promise<any> {
    const response = await apiManager.post(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiManager.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      apiManager.setAuthToken(null);
    }
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): any | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get auth token
   */
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Initialize auth state
   */
  static initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      apiManager.setAuthToken(token);
    }
  }
}
