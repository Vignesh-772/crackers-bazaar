package com.crackersbazaar.repository;

import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    // Find products by manufacturer
    List<Product> findByManufacturer(Manufacturer manufacturer);
    
    Page<Product> findByManufacturer(Manufacturer manufacturer, Pageable pageable);
    
    List<Product> findByManufacturerAndIsActive(Manufacturer manufacturer, Boolean isActive);
    
    Page<Product> findByManufacturerAndIsActive(Manufacturer manufacturer, Boolean isActive, Pageable pageable);
    
    // Find products by category
    List<Product> findByCategory(String category);
    
    Page<Product> findByCategory(String category, Pageable pageable);
    
    List<Product> findByCategoryAndIsActive(String category, Boolean isActive);
    
    Page<Product> findByCategoryAndIsActive(String category, Boolean isActive, Pageable pageable);
    
    // Find products by subcategory
    List<Product> findBySubcategory(String subcategory);
    
    Page<Product> findBySubcategory(String subcategory, Pageable pageable);
    
    List<Product> findBySubcategoryAndIsActive(String subcategory, Boolean isActive);
    
    Page<Product> findBySubcategoryAndIsActive(String subcategory, Boolean isActive, Pageable pageable);
    
    // Find products by price range
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    List<Product> findByPriceBetweenAndIsActive(BigDecimal minPrice, BigDecimal maxPrice, Boolean isActive);
    
    Page<Product> findByPriceBetweenAndIsActive(BigDecimal minPrice, BigDecimal maxPrice, Boolean isActive, Pageable pageable);
    
    // Find products by manufacturer and category
    List<Product> findByManufacturerAndCategory(Manufacturer manufacturer, String category);
    
    Page<Product> findByManufacturerAndCategory(Manufacturer manufacturer, String category, Pageable pageable);
    
    List<Product> findByManufacturerAndCategoryAndIsActive(Manufacturer manufacturer, String category, Boolean isActive);
    
    Page<Product> findByManufacturerAndCategoryAndIsActive(Manufacturer manufacturer, String category, Boolean isActive, Pageable pageable);
    
    // Search products by name
    List<Product> findByNameContainingIgnoreCase(String name);
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    List<Product> findByNameContainingIgnoreCaseAndIsActive(String name, Boolean isActive);
    
    Page<Product> findByNameContainingIgnoreCaseAndIsActive(String name, Boolean isActive, Pageable pageable);
    
    // Search products by description
    List<Product> findByDescriptionContainingIgnoreCase(String description);
    
    Page<Product> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);
    
    List<Product> findByDescriptionContainingIgnoreCaseAndIsActive(String description, Boolean isActive);
    
    Page<Product> findByDescriptionContainingIgnoreCaseAndIsActive(String description, Boolean isActive, Pageable pageable);
    
    // Find products by brand
    List<Product> findByBrand(String brand);
    
    Page<Product> findByBrand(String brand, Pageable pageable);
    
    List<Product> findByBrandAndIsActive(String brand, Boolean isActive);
    
    Page<Product> findByBrandAndIsActive(String brand, Boolean isActive, Pageable pageable);
    
    // Find products by SKU
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findBySkuAndIsActive(String sku, Boolean isActive);
    
    // Find products by barcode
    Optional<Product> findByBarcode(String barcode);
    
    Optional<Product> findByBarcodeAndIsActive(String barcode, Boolean isActive);
    
    // Find featured products
    List<Product> findByIsFeaturedAndIsActive(Boolean isFeatured, Boolean isActive);
    
    Page<Product> findByIsFeaturedAndIsActive(Boolean isFeatured, Boolean isActive, Pageable pageable);
    
    // Find products with low stock
    List<Product> findByStockQuantityLessThan(Integer threshold);
    
    Page<Product> findByStockQuantityLessThan(Integer threshold, Pageable pageable);
    
    List<Product> findByStockQuantityLessThanAndIsActive(Integer threshold, Boolean isActive);
    
    Page<Product> findByStockQuantityLessThanAndIsActive(Integer threshold, Boolean isActive, Pageable pageable);
    
    // Find products with no stock
    List<Product> findByStockQuantity(Integer stockQuantity);
    
    Page<Product> findByStockQuantity(Integer stockQuantity, Pageable pageable);
    
    List<Product> findByStockQuantityAndIsActive(Integer stockQuantity, Boolean isActive);
    
    Page<Product> findByStockQuantityAndIsActive(Integer stockQuantity, Boolean isActive, Pageable pageable);
    
    // Count products by manufacturer
    Long countByManufacturer(Manufacturer manufacturer);
    
    Long countByManufacturerAndIsActive(Manufacturer manufacturer, Boolean isActive);
    
    // Count products by category
    Long countByCategory(String category);
    
    Long countByCategoryAndIsActive(String category, Boolean isActive);
    
    // Complex search query
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:subcategory IS NULL OR p.subcategory = :subcategory) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:brand IS NULL OR p.brand = :brand) AND " +
           "(:isActive IS NULL OR p.isActive = :isActive) AND " +
           "(:manufacturer IS NULL OR p.manufacturer = :manufacturer)")
    Page<Product> searchProducts(@Param("name") String name,
                                @Param("category") String category,
                                @Param("subcategory") String subcategory,
                                @Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice,
                                @Param("brand") String brand,
                                @Param("isActive") Boolean isActive,
                                @Param("manufacturer") Manufacturer manufacturer,
                                Pageable pageable);
    
    // Find products by tags
    @Query("SELECT p FROM Product p WHERE p.tags LIKE %:tag%")
    List<Product> findByTag(@Param("tag") String tag);
    
    @Query("SELECT p FROM Product p WHERE p.tags LIKE %:tag%")
    Page<Product> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.tags LIKE %:tag% AND p.isActive = :isActive")
    List<Product> findByTagAndIsActive(@Param("tag") String tag, @Param("isActive") Boolean isActive);
    
    @Query("SELECT p FROM Product p WHERE p.tags LIKE %:tag% AND p.isActive = :isActive")
    Page<Product> findByTagAndIsActive(@Param("tag") String tag, @Param("isActive") Boolean isActive, Pageable pageable);
}
