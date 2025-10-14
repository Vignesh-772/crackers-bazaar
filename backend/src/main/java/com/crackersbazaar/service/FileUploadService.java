package com.crackersbazaar.service;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.upload.max-size:10485760}") // 10MB
    private long maxFileSize;
    
    @Value("${app.upload.allowed-types:image/jpeg,image/png,image/gif,image/webp}")
    private String allowedTypes;
    
    public List<String> uploadProductImages(List<MultipartFile> files, Long productId) throws IOException {
        List<String> uploadedUrls = new ArrayList<>();
        
        // Create product-specific directory
        String productDir = uploadDir + "/products/" + productId;
        Path productPath = Paths.get(productDir);
        Files.createDirectories(productPath);
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            
            // Validate file
            validateFile(file);
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save original file
            Path filePath = productPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create thumbnail
            createThumbnail(filePath.toString(), productPath.resolve("thumb_" + filename).toString());
            
            // Generate URL (you might want to use a proper URL builder)
            String fileUrl = "/uploads/products/" + productId + "/" + filename;
            uploadedUrls.add(fileUrl);
        }
        
        return uploadedUrls;
    }
    
    public String uploadSingleImage(MultipartFile file, Long productId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        validateFile(file);
        
        // Create product-specific directory
        String productDir = uploadDir + "/products/" + productId;
        Path productPath = Paths.get(productDir);
        Files.createDirectories(productPath);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + extension;
        
        // Save original file
        Path filePath = productPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create thumbnail
        createThumbnail(filePath.toString(), productPath.resolve("thumb_" + filename).toString());
        
        // Generate URL
        return "/uploads/products/" + productId + "/" + filename;
    }
    
    public void deleteProductImages(Long productId) throws IOException {
        String productDir = uploadDir + "/products/" + productId;
        Path productPath = Paths.get(productDir);
        
        if (Files.exists(productPath)) {
            Files.walk(productPath)
                .sorted((a, b) -> b.compareTo(a)) // Delete files first, then directories
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        // Log error but continue
                        System.err.println("Failed to delete file: " + path);
                    }
                });
        }
    }
    
    public void deleteImage(String imageUrl) throws IOException {
        // Extract file path from URL
        String filePath = uploadDir + imageUrl.replace("/uploads", "");
        Path path = Paths.get(filePath);
        
        if (Files.exists(path)) {
            Files.delete(path);
            
            // Also delete thumbnail if it exists
            String thumbnailPath = path.getParent().toString() + "/thumb_" + path.getFileName();
            Path thumbPath = Paths.get(thumbnailPath);
            if (Files.exists(thumbPath)) {
                Files.delete(thumbPath);
            }
        }
    }
    
    private void validateFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }
        
        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedType(contentType)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + allowedTypes);
        }
    }
    
    private boolean isAllowedType(String contentType) {
        String[] allowed = allowedTypes.split(",");
        for (String type : allowed) {
            if (contentType.equals(type.trim())) {
                return true;
            }
        }
        return false;
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex == -1 ? "" : filename.substring(lastDotIndex);
    }
    
    private void createThumbnail(String originalPath, String thumbnailPath) throws IOException {
        try {
            Thumbnails.of(originalPath)
                .size(300, 300)
                .keepAspectRatio(true)
                .toFile(thumbnailPath);
        } catch (Exception e) {
            // Log error but don't fail the upload
            System.err.println("Failed to create thumbnail: " + e.getMessage());
        }
    }
}
