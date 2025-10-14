import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProductApiService, Product } from '../services/ProductService';
import './ProductList.css';

interface ProductListProps {
  manufacturerId?: number;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: number) => void;
  showActions?: boolean;
  autoFetch?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  manufacturerId, 
  onEditProduct, 
  onDeleteProduct,
  showActions = true,
  autoFetch = true
}) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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

  useEffect(() => {
    // Only fetch products if autoFetch is enabled and we have a valid context
    if (autoFetch && typeof window !== 'undefined') {
      fetchProducts();
    }
  }, [autoFetch, manufacturerId, searchTerm, categoryFilter, sortBy, sortOrder, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have a valid token before making the API call
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      let data;
      
      if (manufacturerId) {
        data = await ProductApiService.getProductsByManufacturer(manufacturerId, {
          page: currentPage,
          size: 10,
          sortBy,
          sortDir: sortOrder
        });
      } else if (searchTerm) {
        data = await ProductApiService.searchProductsByName(searchTerm, {
          page: currentPage,
          size: 10,
          sortBy,
          sortDir: sortOrder
        });
      } else if (categoryFilter) {
        data = await ProductApiService.getProductsByCategory(categoryFilter, {
          page: currentPage,
          size: 10,
          sortBy,
          sortDir: sortOrder
        });
      } else {
        data = await ProductApiService.getProducts({
          page: currentPage,
          size: 10,
          sortBy,
          sortDir: sortOrder
        });
      }

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Set empty arrays to prevent UI issues
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProducts();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleToggleStatus = async (productId: number) => {
    try {
      await ProductApiService.toggleProductStatus(productId);
      // Refresh the product list
      fetchProducts();
    } catch (err) {
      console.error('Error toggling product status:', err);
      alert('Failed to toggle product status');
    }
  };

  const handleToggleFeatured = async (productId: number) => {
    try {
      await ProductApiService.toggleFeaturedStatus(productId);
      // Refresh the product list
      fetchProducts();
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Failed to toggle featured status');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await ProductApiService.deleteProduct(productId);
      onDeleteProduct?.(productId);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="product-list">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list">
        <div className="error">
          <h3>Unable to load products</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products</h2>
        <div className="product-stats">
          Total: {totalElements} products
        </div>
      </div>

      <div className="product-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stockQuantity-asc">Stock Low to High</option>
            <option value="stockQuantity-desc">Stock High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img src={product.imageUrls[0]} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                {product.isFeatured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                {product.subcategory && (
                  <p className="product-subcategory">{product.subcategory}</p>
                )}
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-stock">
                  Stock: {product.stockQuantity} units
                </p>
                {product.brand && (
                  <p className="product-brand">Brand: {product.brand}</p>
                )}
                {product.sku && (
                  <p className="product-sku">SKU: {product.sku}</p>
                )}
                <div className="product-status">
                  <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="product-date">
                  Added: {formatDate(product.createdAt)}
                </p>
              </div>

              {showActions && (
                <div className="product-actions">
                  <button
                    onClick={() => onEditProduct?.(product)}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    className={`btn btn-sm ${product.isActive ? 'btn-warning' : 'btn-success'}`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(product.id)}
                    className={`btn btn-sm ${product.isFeatured ? 'btn-secondary' : 'btn-info'}`}
                  >
                    {product.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
