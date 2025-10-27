package com.crackersbazaar.service;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileUploadService {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.upload.max-size:10485760}") // 10MB
    private long maxFileSize;
    
    @Value("${app.upload.compress-threshold:2097152}") // 2MB - compress if larger
    private long compressThreshold;
    
    @Value("${app.upload.max-width:1920}")
    private int maxWidth;
    
    @Value("${app.upload.max-height:1920}")
    private int maxHeight;
    
    @Value("${app.upload.quality:0.85}") // 85% quality for compression
    private double compressionQuality;
    
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
            String filename = java.util.UUID.randomUUID().toString() + extension;
            
            Path filePath = productPath.resolve(filename);
            
            // Compress and save image
            long originalSize = file.getSize();
            compressAndSaveImage(file, filePath);
            long compressedSize = Files.size(filePath);
            
            // Log compression results
            if (originalSize > compressThreshold) {
                double compressionRatio = ((double)(originalSize - compressedSize) / originalSize) * 100;
                System.out.println(String.format("Image compressed: %s -> %s (%.1f%% reduction)", 
                    formatFileSize(originalSize), formatFileSize(compressedSize), compressionRatio));
            }
            
            // Create thumbnail
            createThumbnail(filePath.toString(), productPath.resolve("thumb_" + filename).toString());
            
            // Generate URL
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
        String filename = java.util.UUID.randomUUID().toString() + extension;
        
        Path filePath = productPath.resolve(filename);
        
        // Compress and save image
        long originalSize = file.getSize();
        compressAndSaveImage(file, filePath);
        long compressedSize = Files.size(filePath);
        
        // Log compression results
        if (originalSize > compressThreshold) {
            double compressionRatio = ((double)(originalSize - compressedSize) / originalSize) * 100;
            System.out.println(String.format("Image compressed: %s -> %s (%.1f%% reduction)", 
                formatFileSize(originalSize), formatFileSize(compressedSize), compressionRatio));
        }
        
        // Create thumbnail
        createThumbnail(filePath.toString(), productPath.resolve("thumb_" + filename).toString());
        
        // Generate URL
        return "/uploads/products/" + productId + "/" + filename;
    }
    
    public void deleteProductImages(String productId) throws IOException {
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
                .outputQuality(0.8)
                .toFile(thumbnailPath);
        } catch (Exception e) {
            // Log error but don't fail the upload
            System.err.println("Failed to create thumbnail: " + e.getMessage());
        }
    }
    
    /**
     * Compress and save image if it exceeds threshold
     */
    private void compressAndSaveImage(MultipartFile file, Path targetPath) throws IOException {
        long fileSize = file.getSize();
        
        // If file is small enough, save directly
        if (fileSize <= compressThreshold) {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return;
        }
        
        // For larger files, compress using Thumbnailator
        try {
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            
            if (originalImage == null) {
                // Not an image or corrupt, save as-is
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                return;
            }
            
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            
            // Calculate new dimensions if image is too large
            int targetWidth = Math.min(originalWidth, maxWidth);
            int targetHeight = Math.min(originalHeight, maxHeight);
            
            // Compress and resize
            Thumbnails.of(originalImage)
                .size(targetWidth, targetHeight)
                .keepAspectRatio(true)
                .outputQuality(compressionQuality)
                .toFile(targetPath.toFile());
                
        } catch (Exception e) {
            System.err.println("Compression failed, saving original: " + e.getMessage());
            // Fallback: save original if compression fails
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
    }
    
    /**
     * Format file size for human-readable output
     */
    private String formatFileSize(long size) {
        if (size < 1024) return size + " B";
        int exp = (int) (Math.log(size) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", size / Math.pow(1024, exp), pre);
    }
    
    /**
     * Upload image for temporary storage (before product is created)
     */
    public String uploadTempImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        validateFile(file);
        
        // Create temp directory
        String tempDir = uploadDir + "/temp";
        Path tempPath = Paths.get(tempDir);
        Files.createDirectories(tempPath);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = java.util.UUID.randomUUID().toString() + extension;
        
        Path filePath = tempPath.resolve(filename);
        
        // Compress and save
        long originalSize = file.getSize();
        compressAndSaveImage(file, filePath);
        long compressedSize = Files.size(filePath);
        
        System.out.println(String.format("Temp image uploaded: %s (compressed from %s to %s)", 
            filename, formatFileSize(originalSize), formatFileSize(compressedSize)));
        
        // Generate URL
        return "/uploads/temp/" + filename;
    }
}
