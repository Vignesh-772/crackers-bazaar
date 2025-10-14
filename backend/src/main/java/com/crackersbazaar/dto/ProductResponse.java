package com.crackersbazaar.dto;

import com.crackersbazaar.entity.Product;
import com.crackersbazaar.entity.Manufacturer;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String subcategory;
    private Integer stockQuantity;
    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;
    private BigDecimal weight;
    private String dimensions;
    private String color;
    private String material;
    private String brand;
    private String modelNumber;
    private String sku;
    private String barcode;
    private Boolean isActive;
    private Boolean isFeatured;
    private String tags;
    private String warrantyPeriod;
    private String returnPolicy;
    private String shippingInfo;
    private Long manufacturerId;
    private String manufacturerName;
    private String manufacturerEmail;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProductResponse() {}
    
    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.category = product.getCategory();
        this.subcategory = product.getSubcategory();
        this.stockQuantity = product.getStockQuantity();
        this.minOrderQuantity = product.getMinOrderQuantity();
        this.maxOrderQuantity = product.getMaxOrderQuantity();
        this.weight = product.getWeight();
        this.dimensions = product.getDimensions();
        this.color = product.getColor();
        this.material = product.getMaterial();
        this.brand = product.getBrand();
        this.modelNumber = product.getModelNumber();
        this.sku = product.getSku();
        this.barcode = product.getBarcode();
        this.isActive = product.getIsActive();
        this.isFeatured = product.getIsFeatured();
        this.tags = product.getTags();
        this.warrantyPeriod = product.getWarrantyPeriod();
        this.returnPolicy = product.getReturnPolicy();
        this.shippingInfo = product.getShippingInfo();
        this.imageUrls = product.getImageUrls();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
        
        // Set manufacturer information
        if (product.getManufacturer() != null) {
            this.manufacturerId = product.getManufacturer().getId();
            this.manufacturerName = product.getManufacturer().getCompanyName();
            this.manufacturerEmail = product.getManufacturer().getEmail();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getSubcategory() {
        return subcategory;
    }
    
    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }
    
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public Integer getMinOrderQuantity() {
        return minOrderQuantity;
    }
    
    public void setMinOrderQuantity(Integer minOrderQuantity) {
        this.minOrderQuantity = minOrderQuantity;
    }
    
    public Integer getMaxOrderQuantity() {
        return maxOrderQuantity;
    }
    
    public void setMaxOrderQuantity(Integer maxOrderQuantity) {
        this.maxOrderQuantity = maxOrderQuantity;
    }
    
    public BigDecimal getWeight() {
        return weight;
    }
    
    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getMaterial() {
        return material;
    }
    
    public void setMaterial(String material) {
        this.material = material;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModelNumber() {
        return modelNumber;
    }
    
    public void setModelNumber(String modelNumber) {
        this.modelNumber = modelNumber;
    }
    
    public String getSku() {
        return sku;
    }
    
    public void setSku(String sku) {
        this.sku = sku;
    }
    
    public String getBarcode() {
        return barcode;
    }
    
    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public String getWarrantyPeriod() {
        return warrantyPeriod;
    }
    
    public void setWarrantyPeriod(String warrantyPeriod) {
        this.warrantyPeriod = warrantyPeriod;
    }
    
    public String getReturnPolicy() {
        return returnPolicy;
    }
    
    public void setReturnPolicy(String returnPolicy) {
        this.returnPolicy = returnPolicy;
    }
    
    public String getShippingInfo() {
        return shippingInfo;
    }
    
    public void setShippingInfo(String shippingInfo) {
        this.shippingInfo = shippingInfo;
    }
    
    public Long getManufacturerId() {
        return manufacturerId;
    }
    
    public void setManufacturerId(Long manufacturerId) {
        this.manufacturerId = manufacturerId;
    }
    
    public String getManufacturerName() {
        return manufacturerName;
    }
    
    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }
    
    public String getManufacturerEmail() {
        return manufacturerEmail;
    }
    
    public void setManufacturerEmail(String manufacturerEmail) {
        this.manufacturerEmail = manufacturerEmail;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
