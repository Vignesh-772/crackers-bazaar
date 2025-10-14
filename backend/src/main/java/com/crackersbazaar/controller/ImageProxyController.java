package com.crackersbazaar.controller;

import com.crackersbazaar.service.S3StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ImageProxyController {

    @Autowired
    private S3StorageService s3StorageService;

    /**
     * Proxy endpoint to serve images from S3
     * URL format: /api/images/products/{productId}/{filename}
     * Or: /api/images/temp/{filename}
     */
    @GetMapping("/**")
    public ResponseEntity<byte[]> getImage(@RequestParam String key) {
        try {
            // Get image from S3
            byte[] imageBytes = s3StorageService.getImage(key);

            // Determine content type from file extension
            String contentType = determineContentType(key);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("public, max-age=31536000"); // Cache for 1 year

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Alternative endpoint with path variable
     * /api/images/proxy/{folder}/{filename}
     */
    @GetMapping("/proxy/{folder}/{filename}")
    public ResponseEntity<byte[]> getImageByPath(
            @PathVariable String folder,
            @PathVariable String filename) {
        try {
            String s3Key = folder + "/" + filename;
            byte[] imageBytes = s3StorageService.getImage(s3Key);

            String contentType = determineContentType(filename);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("public, max-age=31536000");

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get product image
     * /api/images/products/{productId}/{filename}
     */
    @GetMapping("/products/{productId}/{filename}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long productId,
            @PathVariable String filename) {
        try {
            String s3Key = "products/" + productId + "/" + filename;
            byte[] imageBytes = s3StorageService.getImage(s3Key);

            String contentType = determineContentType(filename);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("public, max-age=31536000");

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get temp image
     * /api/images/temp/{filename}
     */
    @GetMapping("/temp/{filename}")
    public ResponseEntity<byte[]> getTempImage(@PathVariable String filename) {
        try {
            String s3Key = "temp/" + filename;
            byte[] imageBytes = s3StorageService.getImage(s3Key);

            String contentType = determineContentType(filename);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("public, max-age=3600"); // Cache for 1 hour (temp files)

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Determine content type from file extension
     */
    private String determineContentType(String filename) {
        String lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".png")) return "image/png";
        if (lowerFilename.endsWith(".gif")) return "image/gif";
        if (lowerFilename.endsWith(".webp")) return "image/webp";
        return "image/jpeg"; // Default
    }
}

