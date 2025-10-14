package com.crackersbazaar.service;

import com.crackersbazaar.dto.ProductRequest;
import com.crackersbazaar.dto.ProductResponse;
import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.Product;
import com.crackersbazaar.repository.ManufacturerRepository;
import com.crackersbazaar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ManufacturerRepository manufacturerRepository;
    
    public ProductResponse createProduct(ProductRequest request, Long manufacturerId) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        // Check if SKU already exists
        if (request.getSku() != null && !request.getSku().isEmpty()) {
            Optional<Product> existingProduct = productRepository.findBySku(request.getSku());
            if (existingProduct.isPresent()) {
                throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
            }
        }
        
        // Check if barcode already exists
        if (request.getBarcode() != null && !request.getBarcode().isEmpty()) {
            Optional<Product> existingProduct = productRepository.findByBarcode(request.getBarcode());
            if (existingProduct.isPresent()) {
                throw new RuntimeException("Product with barcode " + request.getBarcode() + " already exists");
            }
        }
        
        Product product = new Product();
        setProductFields(request, product);
        product.setManufacturer(manufacturer);
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return new ProductResponse(product);
    }
    
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return new ProductResponse(product);
    }
    
    public ProductResponse getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new RuntimeException("Product not found with barcode: " + barcode));
        return new ProductResponse(product);
    }
    
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getProductsByManufacturer(Long manufacturerId) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        List<Product> products = productRepository.findByManufacturer(manufacturer);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getProductsByManufacturer(Long manufacturerId, Pageable pageable) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        Page<Product> products = productRepository.findByManufacturer(manufacturer, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getActiveProductsByManufacturer(Long manufacturerId) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        List<Product> products = productRepository.findByManufacturerAndIsActive(manufacturer, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getActiveProductsByManufacturer(Long manufacturerId, Pageable pageable) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        Page<Product> products = productRepository.findByManufacturerAndIsActive(manufacturer, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategoryAndIsActive(category, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getProductsByCategory(String category, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryAndIsActive(category, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getProductsBySubcategory(String subcategory) {
        List<Product> products = productRepository.findBySubcategoryAndIsActive(subcategory, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getProductsBySubcategory(String subcategory, Pageable pageable) {
        Page<Product> products = productRepository.findBySubcategoryAndIsActive(subcategory, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Product> products = productRepository.findByPriceBetweenAndIsActive(minPrice, maxPrice, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceBetweenAndIsActive(minPrice, maxPrice, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> searchProductsByName(String name) {
        List<Product> products = productRepository.findByNameContainingIgnoreCaseAndIsActive(name, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> searchProductsByName(String name, Pageable pageable) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCaseAndIsActive(name, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> searchProductsByDescription(String description) {
        List<Product> products = productRepository.findByDescriptionContainingIgnoreCaseAndIsActive(description, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> searchProductsByDescription(String description, Pageable pageable) {
        Page<Product> products = productRepository.findByDescriptionContainingIgnoreCaseAndIsActive(description, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getProductsByBrand(String brand) {
        List<Product> products = productRepository.findByBrandAndIsActive(brand, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getProductsByBrand(String brand, Pageable pageable) {
        Page<Product> products = productRepository.findByBrandAndIsActive(brand, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getFeaturedProducts() {
        List<Product> products = productRepository.findByIsFeaturedAndIsActive(true, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsFeaturedAndIsActive(true, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getLowStockProducts(Integer threshold) {
        List<Product> products = productRepository.findByStockQuantityLessThanAndIsActive(threshold, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getLowStockProducts(Integer threshold, Pageable pageable) {
        Page<Product> products = productRepository.findByStockQuantityLessThanAndIsActive(threshold, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public List<ProductResponse> getOutOfStockProducts() {
        List<Product> products = productRepository.findByStockQuantityAndIsActive(0, true);
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ProductResponse> getOutOfStockProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByStockQuantityAndIsActive(0, true, pageable);
        return products.map(ProductResponse::new);
    }
    
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Check if SKU is being changed and if new SKU already exists
        if (request.getSku() != null && !request.getSku().isEmpty() && 
            !request.getSku().equals(product.getSku())) {
            Optional<Product> existingProduct = productRepository.findBySku(request.getSku());
            if (existingProduct.isPresent()) {
                throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
            }
        }
        
        // Check if barcode is being changed and if new barcode already exists
        if (request.getBarcode() != null && !request.getBarcode().isEmpty() && 
            !request.getBarcode().equals(product.getBarcode())) {
            Optional<Product> existingProduct = productRepository.findByBarcode(request.getBarcode());
            if (existingProduct.isPresent()) {
                throw new RuntimeException("Product with barcode " + request.getBarcode() + " already exists");
            }
        }
        
        setProductFields(request, product);
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    public ProductResponse toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsActive(!product.getIsActive());
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public ProductResponse toggleFeaturedStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsFeatured(!product.getIsFeatured());
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public ProductResponse updateStock(Long id, Integer newStockQuantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        if (newStockQuantity < 0) {
            throw new RuntimeException("Stock quantity cannot be negative");
        }
        
        product.setStockQuantity(newStockQuantity);
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public Long getProductCountByManufacturer(Long manufacturerId) {
        Manufacturer manufacturer = manufacturerRepository.findById(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + manufacturerId));
        
        return productRepository.countByManufacturerAndIsActive(manufacturer, true);
    }
    
    public Long getProductCountByCategory(String category) {
        return productRepository.countByCategoryAndIsActive(category, true);
    }
    
    private void setProductFields(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setSubcategory(request.getSubcategory());
        product.setStockQuantity(request.getStockQuantity());
        product.setMinOrderQuantity(request.getMinOrderQuantity());
        product.setMaxOrderQuantity(request.getMaxOrderQuantity());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());
        product.setColor(request.getColor());
        product.setMaterial(request.getMaterial());
        product.setBrand(request.getBrand());
        product.setModelNumber(request.getModelNumber());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setIsActive(request.getIsActive());
        product.setIsFeatured(request.getIsFeatured());
        product.setTags(request.getTags());
        product.setWarrantyPeriod(request.getWarrantyPeriod());
        product.setReturnPolicy(request.getReturnPolicy());
        product.setShippingInfo(request.getShippingInfo());
        product.setImageUrls(request.getImageUrls());
    }
}
