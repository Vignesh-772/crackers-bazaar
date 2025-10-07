package com.crackersbazaar.controller;

import com.crackersbazaar.dto.ManufacturerRequest;
import com.crackersbazaar.dto.ManufacturerResponse;
import com.crackersbazaar.dto.ManufacturerVerificationRequest;
import com.crackersbazaar.entity.ManufacturerStatus;
import com.crackersbazaar.service.ManufacturerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AdminController {
    
    @Autowired
    private ManufacturerService manufacturerService;
    
    // Manufacturer Management Endpoints
    
    @PostMapping("/manufacturers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> createManufacturer(@Valid @RequestBody ManufacturerRequest request) {
        try {
            ManufacturerResponse response = manufacturerService.createManufacturer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getAllManufacturers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<ManufacturerResponse> manufacturers = manufacturerService.getAllManufacturers(pageable);
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturerById(@PathVariable Long id) {
        try {
            ManufacturerResponse response = manufacturerService.getManufacturerById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturerByEmail(@PathVariable String email) {
        try {
            ManufacturerResponse response = manufacturerService.getManufacturerByEmail(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            ManufacturerStatus manufacturerStatus = ManufacturerStatus.valueOf(status.toUpperCase());
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<ManufacturerResponse> manufacturers = manufacturerService.getManufacturersByStatus(manufacturerStatus, pageable);
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/search/company")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> searchManufacturersByCompanyName(@RequestParam String companyName) {
        try {
            List<ManufacturerResponse> manufacturers = manufacturerService.searchManufacturersByCompanyName(companyName);
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/search/city")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturersByCity(@RequestParam String city) {
        try {
            List<ManufacturerResponse> manufacturers = manufacturerService.getManufacturersByCity(city);
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturers/search/state")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getManufacturersByState(@RequestParam String state) {
        try {
            List<ManufacturerResponse> manufacturers = manufacturerService.getManufacturersByState(state);
            return ResponseEntity.ok(manufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/manufacturers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> updateManufacturer(@PathVariable Long id, @Valid @RequestBody ManufacturerRequest request) {
        try {
            ManufacturerResponse response = manufacturerService.updateManufacturer(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/manufacturers/{id}/verify")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> verifyManufacturer(
            @PathVariable Long id, 
            @Valid @RequestBody ManufacturerVerificationRequest request,
            @RequestHeader("X-Admin-Id") Long adminId) {
        try {
            ManufacturerResponse response = manufacturerService.verifyManufacturer(id, request, adminId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/manufacturers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> deleteManufacturer(@PathVariable Long id) {
        try {
            manufacturerService.deleteManufacturer(id);
            return ResponseEntity.ok(Map.of("message", "Manufacturer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Dashboard Statistics Endpoints
    
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Count manufacturers by status
            stats.put("pendingCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.PENDING));
            stats.put("approvedCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.APPROVED));
            stats.put("rejectedCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.REJECTED));
            stats.put("activeCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.ACTIVE));
            stats.put("suspendedCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.SUSPENDED));
            stats.put("inactiveCount", manufacturerService.getManufacturerCountByStatus(ManufacturerStatus.INACTIVE));
            
            // Verification stats
            stats.put("verifiedCount", manufacturerService.getVerifiedManufacturerCount());
            stats.put("unverifiedCount", manufacturerService.getUnverifiedManufacturerCount());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/dashboard/pending-approvals")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getPendingApprovals() {
        try {
            List<ManufacturerResponse> pendingManufacturers = manufacturerService.getManufacturersByStatus(ManufacturerStatus.PENDING);
            return ResponseEntity.ok(pendingManufacturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
