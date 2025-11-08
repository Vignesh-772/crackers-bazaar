import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  JwtResponse,
  Product,
  ProductRequest,
  PaginatedResponse,
  Manufacturer,
  ManufacturerRequest,
  ManufacturerVerificationRequest,
  DashboardStats,
  Order,
  OrderRequest,
  OrderStatusUpdateRequest,
  OrderStats,
  ApiError,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post<JwtResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/auth/logout");
    return response.data;
  },

  validateToken: async (): Promise<{
    valid: boolean;
    userId?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
    message?: string;
  }> => {
    const response = await apiClient.get<{
      valid: boolean;
      userId?: string;
      username?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      isActive?: boolean;
      message?: string;
    }>("/auth/validate");
    return response.data;
  },
};

// Product APIs
export const productApi = {
  getAllProducts: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>("/products", { params });
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (params: {
    name: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>("/products/search/name", {
      params,
    });
    return response.data;
  },

  getProductsByCategory: async (params: {
    category: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/category/${params.category}`,
      { params: { page: params.page, size: params.size } }
    );
    return response.data;
  },

  createProduct: async (data: ProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  updateProduct: async (id: string, data: ProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },

  toggleProductStatus: async (id: string): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/toggle-status`);
    return response.data;
  },

  toggleFeaturedStatus: async (id: string): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/toggle-featured`);
    return response.data;
  },

  updateStock: async (id: string, stockQuantity: number): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/stock`, null, {
      params: { stockQuantity },
    });
    return response.data;
  },

  getProductsByManufacturer: async (params: {
    manufacturerId: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/manufacturer/${params.manufacturerId}`,
      { params: { page: params.page, size: params.size } }
    );
    return response.data;
  },

  getLowStockProducts: async (params?: {
    threshold?: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>("/products/low-stock", {
      params,
    });
    return response.data;
  },

  getFeaturedProducts: async (params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>("/products/featured", {
      params,
    });
    return response.data;
  },

  // Comprehensive search
  searchProductsAdvanced: async (params: {
    query?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>("/products/search", {
      params,
    });
    return response.data;
  },
};

// Manufacturer APIs (Admin)
export const manufacturerApi = {
  getAllManufacturers: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Manufacturer>> => {
    const response = await apiClient.get<PaginatedResponse<Manufacturer>>("/admin/manufacturers", {
      params,
    });
    return response.data;
  },

  getManufacturerById: async (id: string): Promise<Manufacturer> => {
    const response = await apiClient.get<Manufacturer>(`/admin/manufacturers/${id}`);
    return response.data;
  },

  getManufacturersByStatus: async (params: {
    status: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Manufacturer>> => {
    const response = await apiClient.get<PaginatedResponse<Manufacturer>>(
      `/admin/manufacturers/status/${params.status}`,
      { params: { page: params.page, size: params.size } }
    );
    return response.data;
  },

  createManufacturer: async (data: ManufacturerRequest): Promise<Manufacturer> => {
    const response = await apiClient.post<Manufacturer>("/admin/manufacturers", data);
    return response.data;
  },

  updateManufacturer: async (id: string, data: ManufacturerRequest): Promise<Manufacturer> => {
    const response = await apiClient.put<Manufacturer>(`/admin/manufacturers/${id}`, data);
    return response.data;
  },

  deleteManufacturer: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/admin/manufacturers/${id}`);
    return response.data;
  },

  verifyManufacturer: async (
    id: string,
    data: ManufacturerVerificationRequest
  ): Promise<Manufacturer> => {
    const response = await apiClient.put<Manufacturer>(`/admin/manufacturers/${id}/verify`, data);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/admin/dashboard/stats");
    return response.data;
  },

  getPendingApprovals: async (): Promise<Manufacturer[]> => {
    const response = await apiClient.get<Manufacturer[]>("/admin/dashboard/pending-approvals");
    return response.data;
  },

  searchManufacturersByCompanyName: async (companyName: string): Promise<Manufacturer[]> => {
    const response = await apiClient.get<Manufacturer[]>("/admin/manufacturers/search/company", {
      params: { companyName },
    });
    return response.data;
  },

  // Get manufacturer profile for authenticated user
  getMyProfile: async (): Promise<Manufacturer> => {
    const response = await apiClient.get<Manufacturer>("/manufacturer/profile");
    return response.data;
  },

  // Get manufacturer by user ID (admin only)
  getManufacturerByUserId: async (userId: number): Promise<Manufacturer> => {
    const response = await apiClient.get<Manufacturer>(`/manufacturer/by-user/${userId}`);
    return response.data;
  },
};

// File Upload APIs
export const uploadApi = {
  uploadTempImage: async (file: File): Promise<{ url: string; originalSize: number; originalName: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      message: string;
      url: string;
      originalSize: number;
      originalName: string;
    }>("/upload/temp-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  uploadProductImages: async (
    files: File[],
    productId: string
  ): Promise<{ urls: string[]; count: number }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("productId", productId);

    const response = await apiClient.post<{
      message: string;
      urls: string[];
      count: number;
    }>("/upload/product-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  uploadSingleImage: async (file: File, productId: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    const response = await apiClient.post<{
      message: string;
      url: string;
    }>("/upload/single-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (imageUrl: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>("/upload/image", {
      params: { imageUrl },
    });
    return response.data;
  },
};

// Compliance Tags APIs
export const complianceApi = {
  addTag: async (productId: string, tagType: string, tagValue: string) => {
    const response = await apiClient.post("/admin/compliance-tags", null, {
      params: { productId, tagType, tagValue },
    });
    return response.data;
  },
  getByProduct: async (productId: string) => {
    const response = await apiClient.get(`/admin/compliance-tags/by-product/${productId}`);
    return response.data;
  },
  getByType: async (tagType: string) => {
    const response = await apiClient.get(`/admin/compliance-tags/by-type/${tagType}`);
    return response.data;
  },
  deleteTag: async (id: string) => {
    const response = await apiClient.delete(`/admin/compliance-tags/${id}`);
    return response.data;
  },
};

// Geofencing APIs
export const geofencingApi = {
  getAll: async () => {
    const response = await apiClient.get("/admin/geofencing");
    return response.data;
  },
  getActive: async () => {
    const response = await apiClient.get("/admin/geofencing/active");
    return response.data;
  },
  create: async (rule: any) => {
    const response = await apiClient.post("/admin/geofencing", rule);
    return response.data;
  },
  update: async (id: string, rule: any) => {
    const response = await apiClient.put(`/admin/geofencing/${id}`, rule);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/geofencing/${id}`);
    return response.data;
  },
};

// User Admin APIs
export const userAdminApi = {
  updateRole: async (id: string, role: string) => {
    const response = await apiClient.put(`/admin/users/${id}/role`, null, { params: { role } });
    return response.data;
  },
  suspend: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/suspend`);
    return response.data;
  },
  activate: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/activate`);
    return response.data;
  },
};

// Reports APIs
export const reportsApi = {
  exportAuditLogs: async (from: string, to: string) => {
    const response = await apiClient.get(`/admin/reports/audit-logs/export`, {
      params: { from, to },
      responseType: "blob",
    });
    return response.data as Blob;
  },
};

// Order APIs
export const orderApi = {
  createOrder: async (data: OrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getOrderByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  getAllOrders: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>("/orders", { params });
    return response.data;
  },

  getMyOrders: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>("/orders/my-orders", { params });
    return response.data;
  },

  getOrdersByUserId: async (params: {
    userId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const { userId, ...queryParams } = params;
    const response = await apiClient.get<PaginatedResponse<Order>>(`/orders/user/${userId}`, {
      params: queryParams,
    });
    return response.data;
  },

  getOrdersByStatus: async (params: {
    status: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const { status, ...queryParams } = params;
    const response = await apiClient.get<PaginatedResponse<Order>>(`/orders/status/${status}`, {
      params: queryParams,
    });
    return response.data;
  },

  getManufacturerOrders: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      "/orders/manufacturer/my-orders",
      { params }
    );
    return response.data;
  },

  getOrdersByManufacturerId: async (params: {
    manufacturerId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const { manufacturerId, ...queryParams } = params;
    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders/manufacturer/${manufacturerId}`,
      { params: queryParams }
    );
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    data: OrderStatusUpdateRequest
  ): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/cancel`, null, {
      params: { reason },
    });
    return response.data;
  },

  deleteOrder: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/orders/${id}`);
    return response.data;
  },

  getUserOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<OrderStats>("/orders/stats/user");
    return response.data;
  },

  getManufacturerOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<OrderStats>("/orders/stats/manufacturer");
    return response.data;
  },

  getOrderCountByStatus: async (status: string): Promise<{ status: string; count: number }> => {
    const response = await apiClient.get<{ status: string; count: number }>(
      `/orders/stats/status/${status}`
    );
    return response.data;
  },
};

export default apiClient;


