package com.crackersbazaar.controller;

import com.crackersbazaar.dto.*;
import com.crackersbazaar.entity.OrderStatus;
import com.crackersbazaar.service.OrderService;
import com.crackersbazaar.util.SecurityUtils;
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
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private SecurityUtils securityUtils;
    
    // Order CRUD Operations
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            String userId = securityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }
            
            OrderResponse response = orderService.createOrder(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        try {
            OrderResponse response = orderService.getOrderById(id);
            
            // Check if user has permission to view this order
            String currentUserId = securityUtils.getCurrentUserId();
            String currentUserRole = securityUtils.getCurrentUserRole();
            
            if (!response.getUserId().equals(currentUserId) && 
                !currentUserRole.equals("ADMIN") && 
                !currentUserRole.equals("DASHBOARD_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to view this order"));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrderByOrderNumber(@PathVariable String orderNumber) {
        try {
            OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
            
            // Check if user has permission to view this order
            String currentUserId = securityUtils.getCurrentUserId();
            String currentUserRole = securityUtils.getCurrentUserRole();
            
            if (!response.getUserId().equals(currentUserId) && 
                !currentUserRole.equals("ADMIN") && 
                !currentUserRole.equals("DASHBOARD_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to view this order"));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN')")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getAllOrders(pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            String userId = securityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getOrdersByUserId(userId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN')")
    public ResponseEntity<?> getOrdersByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getOrdersByUserId(userId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN', 'MANUFACTURER')")
    public ResponseEntity<?> getOrdersByStatus(
            @PathVariable OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getOrdersByStatus(status, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturer/my-orders")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> getManufacturerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            String manufacturerId = securityUtils.getCurrentManufacturerId();
            if (manufacturerId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Manufacturer profile not found"));
            }
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getOrdersByManufacturerId(manufacturerId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manufacturer/{manufacturerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN')")
    public ResponseEntity<?> getOrdersByManufacturerId(
            @PathVariable String manufacturerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<OrderResponse> orders = orderService.getOrdersByManufacturerId(manufacturerId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN', 'MANUFACTURER')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String id, 
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        try {
            OrderResponse response = orderService.updateOrderStatus(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelOrder(
            @PathVariable String id,
            @RequestParam(required = false) String reason) {
        try {
            OrderResponse order = orderService.getOrderById(id);
            
            // Check if user has permission to cancel this order
            String currentUserId = securityUtils.getCurrentUserId();
            String currentUserRole = securityUtils.getCurrentUserRole();
            
            if (!order.getUserId().equals(currentUserId) && 
                !currentUserRole.equals("ADMIN") && 
                !currentUserRole.equals("DASHBOARD_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to cancel this order"));
            }
            
            String cancellationReason = reason != null ? reason : "Cancelled by user";
            OrderResponse response = orderService.cancelOrder(id, cancellationReason);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Statistics endpoints
    
    @GetMapping("/stats/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserOrderStats() {
        try {
            String userId = securityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalOrders", orderService.getOrderCountByUserId(userId));
            stats.put("totalSpent", orderService.getTotalSpentByUser(userId));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/stats/manufacturer")
    @PreAuthorize("hasRole('MANUFACTURER')")
    public ResponseEntity<?> getManufacturerOrderStats() {
        try {
            String manufacturerId = securityUtils.getCurrentManufacturerId();
            if (manufacturerId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Manufacturer profile not found"));
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalOrders", orderService.getOrderCountByManufacturer(manufacturerId));
            stats.put("totalRevenue", orderService.getTotalRevenueByManufacturer(manufacturerId));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/stats/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DASHBOARD_ADMIN')")
    public ResponseEntity<?> getOrderCountByStatus(@PathVariable OrderStatus status) {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("status", status);
            stats.put("count", orderService.getOrderCountByStatus(status));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

