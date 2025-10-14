package com.crackersbazaar.util;

import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class SecurityUtils {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ManufacturerRepository manufacturerRepository;

    /**
     * Get the current authenticated user's ID from JWT token
     */
    public Long getCurrentUserId() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                return jwtUtil.extractUserId(token);
            }
        }
        return null;
    }

    /**
     * Get the current authenticated username
     */
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * Get the current user's role from JWT token
     */
    public String getCurrentUserRole() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                return jwtUtil.extractRole(token);
            }
        }
        return null;
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(String role) {
        String currentRole = getCurrentUserRole();
        return currentRole != null && currentRole.equals(role);
    }

    /**
     * Get the current manufacturer ID for the authenticated manufacturer user
     * This is a convenience method that combines getCurrentUserId() and manufacturer lookup
     */
    public Long getCurrentManufacturerId() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return null;
        }
        
        return manufacturerRepository.findByUserId(userId)
                .map(Manufacturer::getId)
                .orElse(null);
    }

    /**
     * Get the current manufacturer for the authenticated manufacturer user
     */
    public Manufacturer getCurrentManufacturer() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return null;
        }
        
        return manufacturerRepository.findByUserId(userId).orElse(null);
    }
}

