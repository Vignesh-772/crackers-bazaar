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

  getProductById: async (id: number): Promise<Product> => {
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

  updateProduct: async (id: number, data: ProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },

  toggleProductStatus: async (id: number): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/toggle-status`);
    return response.data;
  },

  toggleFeaturedStatus: async (id: number): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/toggle-featured`);
    return response.data;
  },

  updateStock: async (id: number, stockQuantity: number): Promise<Product> => {
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

  getManufacturerById: async (id: number): Promise<Manufacturer> => {
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

  updateManufacturer: async (id: number, data: ManufacturerRequest): Promise<Manufacturer> => {
    const response = await apiClient.put<Manufacturer>(`/admin/manufacturers/${id}`, data);
    return response.data;
  },

  deleteManufacturer: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/admin/manufacturers/${id}`);
    return response.data;
  },

  verifyManufacturer: async (
    id: number,
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
    productId: number
  ): Promise<{ urls: string[]; count: number }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("productId", productId.toString());

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

  uploadSingleImage: async (file: File, productId: number): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId.toString());

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

export default apiClient;


