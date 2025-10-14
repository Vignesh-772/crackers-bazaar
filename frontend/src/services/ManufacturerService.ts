import { apiManager } from './ApiManager';
import { API_CONFIG } from '../config/api';
import { Manufacturer, ManufacturerRequest, ManufacturerVerificationRequest } from '../types/manufacturer';
import { PaginatedResponse } from '../config/api';

export class ManufacturerApiService {
  /**
   * Create manufacturer
   */
  static async createManufacturer(data: ManufacturerRequest): Promise<Manufacturer> {
    const response = await apiManager.post<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURERS,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create manufacturer');
  }

  /**
   * Get all manufacturers with pagination
   */
  static async getManufacturers(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Promise<PaginatedResponse<Manufacturer>> {
    const response = await apiManager.getPaginated<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURERS,
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturers');
  }

  /**
   * Get manufacturer by ID
   */
  static async getManufacturerById(id: number): Promise<Manufacturer> {
    const response = await apiManager.get<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURER_BY_ID(id)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturer');
  }

  /**
   * Get manufacturer by email
   */
  static async getManufacturerByEmail(email: string): Promise<Manufacturer> {
    const response = await apiManager.get<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURER_BY_EMAIL(email)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturer');
  }

  /**
   * Get manufacturers by status
   */
  static async getManufacturersByStatus(
    status: string,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Manufacturer>> {
    const response = await apiManager.getPaginated<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURERS_BY_STATUS(status),
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturers by status');
  }

  /**
   * Search manufacturers by company name
   */
  static async searchManufacturers(companyName: string): Promise<Manufacturer[]> {
    const response = await apiManager.get<Manufacturer[]>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SEARCH_MANUFACTURERS}?companyName=${encodeURIComponent(companyName)}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to search manufacturers');
  }

  /**
   * Get manufacturers by city
   */
  static async getManufacturersByCity(city: string): Promise<Manufacturer[]> {
    const response = await apiManager.get<Manufacturer[]>(
      `${API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURERS_BY_CITY}?city=${encodeURIComponent(city)}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturers by city');
  }

  /**
   * Get manufacturers by state
   */
  static async getManufacturersByState(state: string): Promise<Manufacturer[]> {
    const response = await apiManager.get<Manufacturer[]>(
      `${API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURERS_BY_STATE}?state=${encodeURIComponent(state)}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturers by state');
  }

  /**
   * Update manufacturer
   */
  static async updateManufacturer(id: number, data: ManufacturerRequest): Promise<Manufacturer> {
    const response = await apiManager.put<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURER_BY_ID(id),
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update manufacturer');
  }

  /**
   * Verify manufacturer
   */
  static async verifyManufacturer(
    id: number,
    verificationData: ManufacturerVerificationRequest,
    adminId: number
  ): Promise<Manufacturer> {
    const response = await apiManager.put<Manufacturer>(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURER_VERIFY(id),
      verificationData,
      {
        headers: {
          'X-Admin-Id': adminId.toString()
        }
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to verify manufacturer');
  }

  /**
   * Delete manufacturer
   */
  static async deleteManufacturer(id: number): Promise<void> {
    const response = await apiManager.delete(
      API_CONFIG.ENDPOINTS.ADMIN.MANUFACTURER_BY_ID(id)
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete manufacturer');
    }
  }

  /**
   * Get dashboard stats
   */
  static async getDashboardStats(): Promise<any> {
    const response = await apiManager.get(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch dashboard stats');
  }

  /**
   * Get pending approvals
   */
  static async getPendingApprovals(): Promise<Manufacturer[]> {
    const response = await apiManager.get<Manufacturer[]>(
      API_CONFIG.ENDPOINTS.ADMIN.PENDING_APPROVALS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch pending approvals');
  }
}
