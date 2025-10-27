package com.crackersbazaar.controller;

import com.crackersbazaar.dto.RegisterRequest;
import com.crackersbazaar.entity.Role;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('RETAILER') or hasRole('DASHBOARD_ADMIN') or hasRole('ADMIN') or hasRole('MANUFACTURER')")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/create-manufacturer")
    @PreAuthorize("hasRole('DASHBOARD_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> createManufacturer(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (userService.existsByUsername(registerRequest.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username is already taken!");
                return ResponseEntity.badRequest().body(error);
            }

            if (userService.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already in use!");
                return ResponseEntity.badRequest().body(error);
            }

            registerRequest.setRole(Role.MANUFACTURER);
            
            User user = new User(registerRequest.getUsername(), registerRequest.getEmail(),
                    registerRequest.getPassword(), registerRequest.getFirstName(),
                    registerRequest.getLastName(), registerRequest.getRole());

            userService.createUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Manufacturer created successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create manufacturer: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/create-retailer")
    @PreAuthorize("hasRole('DASHBOARD_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> createRetailer(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (userService.existsByUsername(registerRequest.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username is already taken!");
                return ResponseEntity.badRequest().body(error);
            }

            if (userService.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already in use!");
                return ResponseEntity.badRequest().body(error);
            }

            registerRequest.setRole(Role.RETAILER);
            
            User user = new User(registerRequest.getUsername(), registerRequest.getEmail(),
                    registerRequest.getPassword(), registerRequest.getFirstName(),
                    registerRequest.getLastName(), registerRequest.getRole());

            userService.createUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Retailer created successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create retailer: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get users: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasRole('DASHBOARD_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            Role userRole = Role.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid role: " + role);
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get users by role: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable String id) {
        try {
            userService.activateUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User activated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to activate user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable String id) {
        try {
            userService.deactivateUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deactivated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to deactivate user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

