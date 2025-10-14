import { apiManager } from './ApiManager';
import { API_CONFIG } from '../config/api';
import { PaginatedResponse } from '../config/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string;
  color?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string;
  warrantyPeriod?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  manufacturerId: number;
  manufacturerName: string;
  manufacturerEmail: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string;
  color?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  sku?: string;
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string;
  warrantyPeriod?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  imageUrls?: string[];
}

export class ProductApiService {
  /**
   * Create product
   */
  static async createProduct(data: ProductRequest, manufacturerId: number): Promise<Product> {
    const response = await apiManager.post<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BASE,
      data,
      {
        headers: {
          'X-Manufacturer-Id': manufacturerId.toString()
        }
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create product');
  }

  /**
   * Get all products with pagination
   */
  static async getProducts(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BASE,
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch products');
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<Product> {
    const response = await apiManager.get<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch product');
  }

  /**
   * Get products by manufacturer
   */
  static async getProductsByManufacturer(
    manufacturerId: number,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_MANUFACTURER(manufacturerId),
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturer products');
  }

  /**
   * Get active products by manufacturer
   */
  static async getActiveProductsByManufacturer(
    manufacturerId: number,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_MANUFACTURER_ACTIVE(manufacturerId),
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch active manufacturer products');
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    category: string,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY(category),
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch products by category');
  }

  /**
   * Search products by name
   */
  static async searchProductsByName(
    name: string,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH_BY_NAME,
      { name, ...params }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to search products');
  }

  /**
   * Get products by price range
   */
  static async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_PRICE_RANGE,
      { minPrice, maxPrice, ...params }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch products by price range');
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiManager.getPaginated<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.FEATURED,
      params
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch featured products');
  }

  /**
   * Update product
   */
  static async updateProduct(id: number, data: ProductRequest): Promise<Product> {
    const response = await apiManager.put<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id),
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update product');
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number): Promise<void> {
    const response = await apiManager.delete(
      API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product');
    }
  }

  /**
   * Toggle product status
   */
  static async toggleProductStatus(id: number): Promise<Product> {
    const response = await apiManager.put<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to toggle product status');
  }

  /**
   * Toggle featured status
   */
  static async toggleFeaturedStatus(id: number): Promise<Product> {
    const response = await apiManager.put<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.TOGGLE_FEATURED(id)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to toggle featured status');
  }

  /**
   * Update stock quantity
   */
  static async updateStock(id: number, stockQuantity: number): Promise<Product> {
    const response = await apiManager.put<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE_STOCK(id),
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update stock');
  }

  /**
   * Get manufacturer product stats
   */
  static async getManufacturerStats(manufacturerId: number): Promise<any> {
    const response = await apiManager.get(
      API_CONFIG.ENDPOINTS.PRODUCTS.MANUFACTURER_STATS(manufacturerId)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch manufacturer stats');
  }
}
