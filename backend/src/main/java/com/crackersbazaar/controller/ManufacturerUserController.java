package com.crackersbazaar.controller;

import com.crackersbazaar.entity.User;
import com.crackersbazaar.service.ManufacturerUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/manufacturer-users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ManufacturerUserController {
    
    @Autowired
    private ManufacturerUserService manufacturerUserService;
    
    /**
     * Create user account for a manufacturer
     */
    @PostMapping("/create/{manufacturerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> createManufacturerUser(@PathVariable String manufacturerId) {
        try {
            // This would need to be implemented to get manufacturer by ID
            // For now, we'll use email-based approach
            Map<String, String> response = new HashMap<>();
            response.put("message", "Use the email-based endpoint to create user account");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Create user account for a manufacturer by email
     */
    @PostMapping("/create-by-email")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> createManufacturerUserByEmail(@RequestParam String email) {
        try {
            if (manufacturerUserService.hasUserAccount(email)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User account already exists for this manufacturer");
                return ResponseEntity.ok(response);
            }
            
            // This would need manufacturer service to get manufacturer by email
            Map<String, String> response = new HashMap<>();
            response.put("message", "Please use the manufacturer verification process to create user accounts automatically");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Reset password for a manufacturer
     */
    @PostMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> resetManufacturerPassword(@RequestParam String email) {
        try {
            String newPassword = manufacturerUserService.resetManufacturerPassword(email);
            User user = manufacturerUserService.getManufacturerUser(email);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully");
            response.put("newPassword", newPassword);
            response.put("username", user.getUsername());
            response.put("email", email);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Check if manufacturer has user account
     */
    @GetMapping("/check-account")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> checkManufacturerAccount(@RequestParam String email) {
        try {
            boolean hasAccount = manufacturerUserService.hasUserAccount(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hasAccount", hasAccount);
            response.put("email", email);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
