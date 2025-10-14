import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProductApiService, ProductRequest } from '../services/ProductService';
import { FileUploadService } from '../services/FileUploadService';
import './ProductManagement.css';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
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
  imageUrls?: string[];
}

interface ProductManagementProps {
  onProductSaved?: (product: Product) => void;
  onCancel?: () => void;
  editProduct?: Product;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ 
  onProductSaved, 
  onCancel, 
  editProduct 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: undefined,
    weight: undefined,
    dimensions: '',
    color: '',
    material: '',
    brand: '',
    modelNumber: '',
    sku: '',
    barcode: '',
    isActive: true,
    isFeatured: false,
    tags: '',
    warrantyPeriod: '',
    returnPolicy: '',
    shippingInfo: '',
    imageUrls: []
  });

  useEffect(() => {
    if (editProduct) {
      setFormData(editProduct);
      if (editProduct.imageUrls) {
        setImageUrls(editProduct.imageUrls);
      }
    }
  }, [editProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId: number) => {
    if (images.length === 0) return [];

    try {
      const result = await FileUploadService.uploadProductImages(images, productId);
      return result.urls || [];
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert form data to ProductRequest format
      const productRequest: ProductRequest = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        subcategory: formData.subcategory,
        stockQuantity: formData.stockQuantity,
        minOrderQuantity: formData.minOrderQuantity,
        maxOrderQuantity: formData.maxOrderQuantity,
        weight: formData.weight,
        dimensions: formData.dimensions,
        color: formData.color,
        material: formData.material,
        brand: formData.brand,
        modelNumber: formData.modelNumber,
        sku: formData.sku,
        barcode: formData.barcode,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        tags: formData.tags,
        warrantyPeriod: formData.warrantyPeriod,
        returnPolicy: formData.returnPolicy,
        shippingInfo: formData.shippingInfo,
        imageUrls: [...imageUrls]
      };

      let savedProduct;
      
      if (editProduct && editProduct.id) {
        // Update existing product
        savedProduct = await ProductApiService.updateProduct(editProduct.id, productRequest);
      } else {
        // Create new product
        savedProduct = await ProductApiService.createProduct(productRequest, 0); // Manufacturer ID will be resolved on backend
      }

      // Upload new images if any
      if (images.length > 0 && savedProduct.id) {
        const uploadedUrls = await uploadImages(savedProduct.id);
        savedProduct.imageUrls = [...imageUrls, ...uploadedUrls];
      }

      onProductSaved?.(savedProduct);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Firecrackers',
    'Sparklers',
    'Fountains',
    'Rockets',
    'Bombs',
    'Chakras',
    'Flower Pots',
    'Ground Spinners',
    'Wheels',
    'Novelty Items'
  ];

  return (
    <div className="product-management">
      <div className="product-form-container">
        <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Enter subcategory"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter product description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity *</label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="minOrderQuantity">Min Order Quantity</label>
              <input
                type="number"
                id="minOrderQuantity"
                name="minOrderQuantity"
                value={formData.minOrderQuantity}
                onChange={handleInputChange}
                min="1"
                placeholder="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sku">SKU</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dimensions">Dimensions</label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="L x W x H"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Enter material"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="form-group">
            <label htmlFor="warrantyPeriod">Warranty Period</label>
            <input
              type="text"
              id="warrantyPeriod"
              name="warrantyPeriod"
              value={formData.warrantyPeriod}
              onChange={handleInputChange}
              placeholder="e.g., 1 year, 6 months"
            />
          </div>

          <div className="form-group">
            <label htmlFor="returnPolicy">Return Policy</label>
            <textarea
              id="returnPolicy"
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter return policy"
            />
          </div>

          <div className="form-group">
            <label htmlFor="shippingInfo">Shipping Information</label>
            <textarea
              id="shippingInfo"
              name="shippingInfo"
              value={formData.shippingInfo}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter shipping information"
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Product Images</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="image-preview">
              {images.map((file, index) => (
                <div key={index} className="image-item">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  <button type="button" onClick={() => removeImage(index)}>Remove</button>
                </div>
              ))}
              {imageUrls.map((url, index) => (
                <div key={`url-${index}`} className="image-item">
                  <img src={url} alt={`Existing ${index}`} />
                  <button type="button" onClick={() => removeImageUrl(index)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-checkboxes">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <label htmlFor="isActive">Active Product</label>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
              />
              <label htmlFor="isFeatured">Featured Product</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
