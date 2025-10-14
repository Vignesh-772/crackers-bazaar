// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
    },
    // Admin endpoints
    ADMIN: {
      MANUFACTURERS: '/api/admin/manufacturers',
      MANUFACTURER_BY_ID: (id: number) => `/api/admin/manufacturers/${id}`,
      MANUFACTURER_VERIFY: (id: number) => `/api/admin/manufacturers/${id}/verify`,
      MANUFACTURER_BY_EMAIL: (email: string) => `/api/admin/manufacturers/email/${email}`,
      MANUFACTURERS_BY_STATUS: (status: string) => `/api/admin/manufacturers/status/${status}`,
      SEARCH_MANUFACTURERS: '/api/admin/manufacturers/search/company',
      MANUFACTURERS_BY_CITY: '/api/admin/manufacturers/search/city',
      MANUFACTURERS_BY_STATE: '/api/admin/manufacturers/search/state',
      DASHBOARD_STATS: '/api/admin/dashboard/stats',
      PENDING_APPROVALS: '/api/admin/dashboard/pending-approvals',
    },
    // Product endpoints
    PRODUCTS: {
      BASE: '/api/products',
      BY_ID: (id: number) => `/api/products/${id}`,
      BY_SKU: (sku: string) => `/api/products/sku/${sku}`,
      BY_BARCODE: (barcode: string) => `/api/products/barcode/${barcode}`,
      BY_MANUFACTURER: (manufacturerId: number) => `/api/products/manufacturer/${manufacturerId}`,
      BY_MANUFACTURER_ACTIVE: (manufacturerId: number) => `/api/products/manufacturer/${manufacturerId}/active`,
      BY_CATEGORY: (category: string) => `/api/products/category/${category}`,
      BY_SUBCATEGORY: (subcategory: string) => `/api/products/subcategory/${subcategory}`,
      BY_PRICE_RANGE: '/api/products/price-range',
      SEARCH_BY_NAME: '/api/products/search/name',
      SEARCH_BY_DESCRIPTION: '/api/products/search/description',
      BY_BRAND: (brand: string) => `/api/products/brand/${brand}`,
      FEATURED: '/api/products/featured',
      LOW_STOCK: '/api/products/low-stock',
      OUT_OF_STOCK: '/api/products/out-of-stock',
      TOGGLE_STATUS: (id: number) => `/api/products/${id}/toggle-status`,
      TOGGLE_FEATURED: (id: number) => `/api/products/${id}/toggle-featured`,
      UPDATE_STOCK: (id: number) => `/api/products/${id}/stock`,
      MANUFACTURER_STATS: (manufacturerId: number) => `/api/products/manufacturer/${manufacturerId}/stats`,
      CATEGORY_STATS: (category: string) => `/api/products/category/${category}/stats`,
    },
    // File upload endpoints
    UPLOAD: {
      PRODUCT_IMAGES: '/api/upload/product-images',
      SINGLE_IMAGE: '/api/upload/single-image',
      DELETE_PRODUCT_IMAGES: (productId: number) => `/api/upload/product-images/${productId}`,
      DELETE_IMAGE: '/api/upload/image',
    },
    // Manufacturer user endpoints
    MANUFACTURER_USERS: {
      CREATE: (manufacturerId: number) => `/api/admin/manufacturer-users/create/${manufacturerId}`,
      CREATE_BY_EMAIL: '/api/admin/manufacturer-users/create-by-email',
      RESET_PASSWORD: '/api/admin/manufacturer-users/reset-password',
      CHECK_ACCOUNT: '/api/admin/manufacturer-users/check-account',
    },
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Request/Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Request configuration
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  showLoading?: boolean;
  showError?: boolean;
}
