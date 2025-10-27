package com.crackersbazaar.controller;

import com.crackersbazaar.dto.ManufacturerResponse;
import com.crackersbazaar.service.ManufacturerService;
import com.crackersbazaar.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/manufacturer")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ManufacturerController {
    
    @Autowired
    private ManufacturerService manufacturerService;
    
    @Autowired
    private SecurityUtils securityUtils;
    
    /**
     * Get manufacturer profile for the authenticated user
     * Uses userId from JWT token for quick access
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> getMyProfile() {
        try {
            // Get user ID directly from JWT token
            String userId = securityUtils.getCurrentUserId();
            
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID not found in token"));
            }
            
            ManufacturerResponse manufacturer = manufacturerService.getManufacturerByUserId(userId);
            return ResponseEntity.ok(manufacturer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get manufacturer by user ID (admin can use this)
     */
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturerByUserId(@PathVariable String userId) {
        try {
            ManufacturerResponse manufacturer = manufacturerService.getManufacturerByUserId(userId);
            return ResponseEntity.ok(manufacturer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

