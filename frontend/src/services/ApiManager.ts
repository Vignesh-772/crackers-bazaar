import { API_CONFIG, ApiResponse, ApiError, RequestConfig, PaginatedResponse } from '../config/api';

class ApiManager {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Build full URL
   */
  private buildURL(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Handle response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    const result: ApiResponse<T> = {
      data: data,
      status: response.status,
      success: response.ok,
    };

    if (!response.ok) {
      result.error = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
    }

    return result;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    const token = this.getAuthToken();
    
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method: config.method,
      headers,
    };

    if (config.body) {
      if (config.body instanceof FormData) {
        delete headers['Content-Type']; // Let browser set it for FormData
        requestConfig.body = config.body;
      } else {
        requestConfig.body = JSON.stringify(config.body);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const result = await this.handleResponse<T>(response);
      
      // Handle token expiration
      if (response.status === 401) {
        this.handleTokenExpiration();
      }
      
      return result;
    } catch (error: any) {
      // Handle network errors and retries
      if (attempt < (config.retries || API_CONFIG.RETRY_ATTEMPTS)) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
        return this.makeRequest<T>(endpoint, config, attempt + 1);
      }
      
      throw this.createApiError(error);
    }
  }

  /**
   * Handle token expiration
   */
  private handleTokenExpiration() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setAuthToken(null);
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Create API error
   */
  private createApiError(error: any): ApiError {
    return {
      message: error.message || 'An unexpected error occurred',
      status: error.status || 0,
      code: error.code,
      details: error,
    };
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', ...config });
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: any, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body: data, ...config });
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: any, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body: data, ...config });
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', ...config });
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body: data, ...config });
  }

  /**
   * Upload file
   */
  async uploadFile<T>(endpoint: string, formData: FormData, config: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body: formData, ...config });
  }

  /**
   * Get paginated data
   */
  async getPaginated<T>(
    endpoint: string,
    params: Record<string, any> = {},
    config: Partial<RequestConfig> = {}
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.get<PaginatedResponse<T>>(fullEndpoint, config);
  }
}

// Create singleton instance
export const apiManager = new ApiManager();

// Export for convenience
export default apiManager;
