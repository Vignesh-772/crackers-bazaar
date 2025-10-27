package com.crackersbazaar.service;

import com.crackersbazaar.dto.*;
import com.crackersbazaar.entity.*;
import com.crackersbazaar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public OrderResponse createOrder(OrderRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Validate and calculate order totals
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemRequest.getProductId()));
            
            // Check stock availability
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                        ". Available: " + product.getStockQuantity() + ", Requested: " + itemRequest.getQuantity());
            }
            
            // Check if product is active
            if (!product.getIsActive()) {
                throw new RuntimeException("Product is not available: " + product.getName());
            }
            
            // Calculate item total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }
        
        // Calculate total
        BigDecimal shippingCost = request.getShippingCost() != null ? request.getShippingCost() : BigDecimal.ZERO;
        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.0)); // Tax calculation can be customized
        BigDecimal total = subtotal.add(shippingCost).add(tax).subtract(discount);
        
        // Generate order number
        String orderNumber = generateOrderNumber();
        
        // Create order
        Order order = new Order();
        order.setId(java.util.UUID.randomUUID().toString()); // Generate UUID for the order
        order.setUser(user);
        order.setOrderNumber(orderNumber);
        order.setStatus(OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingCost(shippingCost);
        order.setDiscount(discount);
        order.setTotal(total);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingPincode(request.getShippingPincode());
        order.setShippingCountry(request.getShippingCountry());
        order.setBillingAddress(request.getBillingAddress());
        order.setBillingCity(request.getBillingCity());
        order.setBillingState(request.getBillingState());
        order.setBillingPincode(request.getBillingPincode());
        order.setBillingCountry(request.getBillingCountry());
        order.setContactEmail(request.getContactEmail());
        order.setContactPhone(request.getContactPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        order.setNotes(request.getNotes());
        
        // Save order first to get the ID
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update product stock
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            BigDecimal unitPrice = product.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            
            OrderItem orderItem = new OrderItem(savedOrder, product, itemRequest.getQuantity(), unitPrice, itemTotal);
            orderItem.setId(java.util.UUID.randomUUID().toString()); // Generate UUID for the order item
            savedOrder.addOrderItem(orderItem);
            
            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }
        
        // Save order with items
        Order finalOrder = orderRepository.save(savedOrder);
        
        return new OrderResponse(finalOrder);
    }
    
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return new OrderResponse(order);
    }
    
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with order number: " + orderNumber));
        return new OrderResponse(order);
    }
    
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(OrderResponse::new);
    }
    
    public List<OrderResponse> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<OrderResponse> getOrdersByUserId(String userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(OrderResponse::new);
    }
    
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return orders.map(OrderResponse::new);
    }
    
    public List<OrderResponse> getOrdersByManufacturerId(String manufacturerId) {
        List<Order> orders = orderRepository.findOrdersByManufacturerId(manufacturerId);
        return orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<OrderResponse> getOrdersByManufacturerId(String manufacturerId, Pageable pageable) {
        Page<Order> orders = orderRepository.findOrdersByManufacturerId(manufacturerId, pageable);
        return orders.map(OrderResponse::new);
    }
    
    public OrderResponse updateOrderStatus(String id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        
        // Validate status transition
        validateStatusTransition(oldStatus, newStatus);
        
        order.setStatus(newStatus);
        
        // Update timestamps based on status
        switch (newStatus) {
            case SHIPPED:
                order.setShippedAt(LocalDateTime.now());
                if (request.getTrackingNumber() != null) {
                    order.setTrackingNumber(request.getTrackingNumber());
                }
                break;
            case DELIVERED:
                order.setDeliveredAt(LocalDateTime.now());
                break;
            case CANCELLED:
                order.setCancelledAt(LocalDateTime.now());
                if (request.getCancellationReason() != null) {
                    order.setCancellationReason(request.getCancellationReason());
                }
                // Restore product stock
                restoreProductStock(order);
                break;
        }
        
        if (request.getNotes() != null) {
            String existingNotes = order.getNotes() != null ? order.getNotes() + "\n" : "";
            order.setNotes(existingNotes + request.getNotes());
        }
        
        Order savedOrder = orderRepository.save(order);
        return new OrderResponse(savedOrder);
    }
    
    public OrderResponse cancelOrder(String id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        // Only allow cancellation for certain statuses
        if (order.getStatus() == OrderStatus.DELIVERED || 
            order.getStatus() == OrderStatus.CANCELLED ||
            order.getStatus() == OrderStatus.REFUNDED) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(reason);
        
        // Restore product stock
        restoreProductStock(order);
        
        Order savedOrder = orderRepository.save(order);
        return new OrderResponse(savedOrder);
    }
    
    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
    
    public Long getOrderCountByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return orderRepository.countByUser(user);
    }
    
    public Long getOrderCountByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
    
    public Double getTotalSpentByUser(String userId) {
        Double total = orderRepository.getTotalSpentByUser(userId);
        return total != null ? total : 0.0;
    }
    
    public Double getTotalRevenueByManufacturer(String manufacturerId) {
        Double total = orderRepository.getTotalRevenueByManufacturer(manufacturerId);
        return total != null ? total : 0.0;
    }
    
    public Long getOrderCountByManufacturer(String manufacturerId) {
        return orderRepository.countOrdersByManufacturerId(manufacturerId);
    }
    
    // Helper methods
    
    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return "ORD" + now.format(formatter) + String.format("%04d", (int)(Math.random() * 10000));
    }
    
    private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        // Define valid transitions
        if (oldStatus == OrderStatus.DELIVERED && newStatus != OrderStatus.REFUNDED) {
            throw new RuntimeException("Delivered orders can only be refunded");
        }
        if (oldStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot change status of cancelled order");
        }
        if (oldStatus == OrderStatus.REFUNDED) {
            throw new RuntimeException("Cannot change status of refunded order");
        }
    }
    
    private void restoreProductStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }
}

