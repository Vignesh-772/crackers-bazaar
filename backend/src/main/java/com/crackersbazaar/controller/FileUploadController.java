package com.crackersbazaar.controller;

import com.crackersbazaar.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FileUploadController {
    
    @Autowired
    private FileUploadService fileUploadService;
    
    @PostMapping("/product-images")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> uploadProductImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("productId") Long productId) {
        try {
            List<String> uploadedUrls = fileUploadService.uploadProductImages(files, productId);
            return ResponseEntity.ok(Map.of(
                "message", "Images uploaded successfully",
                "urls", uploadedUrls,
                "count", uploadedUrls.size()
            ));
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
    public ResponseEntity<?> deleteProductImages(@PathVariable Long productId) {
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
