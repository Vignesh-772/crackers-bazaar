package com.crackersbazaar.controller;

import com.crackersbazaar.service.FileUploadService;
import com.crackersbazaar.service.S3StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class FileUploadController {
    
    @Autowired
    private FileUploadService fileUploadService;
    
    @Autowired
    private S3StorageService s3StorageService;
    
    @Value("${app.storage.type:local}") // Default to local storage
    private String storageType;
    
    /**
     * Upload temporary image (before product is created)
     * Uploads to S3 or local storage based on configuration
     */
    @PostMapping("/temp-image")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> uploadTempImage(@RequestParam("file") MultipartFile file) {
        try {
            String s3Key;
            
            if ("s3".equalsIgnoreCase(storageType)) {
                // Upload to S3
                s3Key = s3StorageService.uploadImage(file, "temp");
                
                // Return proxy URL instead of direct S3 URL
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Image uploaded to S3 successfully");
                response.put("url", "/api/images?key=" + s3Key);
                response.put("s3Key", s3Key);
                response.put("originalSize", file.getSize());
                response.put("originalName", file.getOriginalFilename());
                response.put("storageType", "s3");
                
                return ResponseEntity.ok(response);
            } else {
                // Upload to local storage (fallback)
                String uploadedUrl = fileUploadService.uploadTempImage(file);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Image uploaded locally successfully");
                response.put("url", uploadedUrl);
                response.put("originalSize", file.getSize());
                response.put("originalName", file.getOriginalFilename());
                response.put("storageType", "local");
                
                return ResponseEntity.ok(response);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
    
    @PostMapping("/product-images")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> uploadProductImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("productId") Long productId) {
        try {
            if ("s3".equalsIgnoreCase(storageType)) {
                // Upload to S3
                List<String> s3Keys = s3StorageService.uploadImages(files, "products/" + productId);
                
                // Convert S3 keys to proxy URLs
                List<String> proxyUrls = s3Keys.stream()
                        .map(key -> "/api/images?key=" + key)
                        .collect(Collectors.toList());
                
                return ResponseEntity.ok(Map.of(
                    "message", "Images uploaded to S3 successfully",
                    "urls", proxyUrls,
                    "s3Keys", s3Keys,
                    "count", proxyUrls.size(),
                    "storageType", "s3"
                ));
            } else {
                // Upload locally
                List<String> uploadedUrls = fileUploadService.uploadProductImages(files, productId);
                return ResponseEntity.ok(Map.of(
                    "message", "Images uploaded locally successfully",
                    "urls", uploadedUrls,
                    "count", uploadedUrls.size(),
                    "storageType", "local"
                ));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload images: " + e.getMessage()));
        }
    }
    
    @PostMapping("/single-image")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> uploadSingleImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId) {
        try {
            String uploadedUrl = fileUploadService.uploadSingleImage(file, productId);
            return ResponseEntity.ok(Map.of(
                "message", "Image uploaded successfully",
                "url", uploadedUrl
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/product-images/{productId}")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> deleteProductImages(@PathVariable String productId) {
        try {
            fileUploadService.deleteProductImages(productId);
            return ResponseEntity.ok(Map.of("message", "Product images deleted successfully"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to delete images: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/image")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        try {
            fileUploadService.deleteImage(imageUrl);
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to delete image: " + e.getMessage()));
        }
    }
}
