import { apiManager } from './ApiManager';
import { API_CONFIG } from '../config/api';

export interface UploadResponse {
  urls?: string[];
  url?: string;
  message: string;
  count?: number;
}

export class FileUploadService {
  /**
   * Upload multiple product images
   */
  static async uploadProductImages(files: File[], productId: number): Promise<UploadResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('productId', productId.toString());

    const response = await apiManager.uploadFile<UploadResponse>(
      API_CONFIG.ENDPOINTS.UPLOAD.PRODUCT_IMAGES,
      formData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to upload images');
  }

  /**
   * Upload single image
   */
  static async uploadSingleImage(file: File, productId: number): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId.toString());

    const response = await apiManager.uploadFile<UploadResponse>(
      API_CONFIG.ENDPOINTS.UPLOAD.SINGLE_IMAGE,
      formData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to upload image');
  }

  /**
   * Delete all product images
   */
  static async deleteProductImages(productId: number): Promise<void> {
    const response = await apiManager.delete(
      API_CONFIG.ENDPOINTS.UPLOAD.DELETE_PRODUCT_IMAGES(productId)
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product images');
    }
  }

  /**
   * Delete specific image
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    const response = await apiManager.delete(
      API_CONFIG.ENDPOINTS.UPLOAD.DELETE_IMAGE,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete image');
    }
  }
}
