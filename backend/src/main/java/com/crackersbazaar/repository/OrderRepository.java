package com.crackersbazaar.repository;

import com.crackersbazaar.entity.Order;
import com.crackersbazaar.entity.OrderStatus;
import com.crackersbazaar.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUser(User user);
    
    Page<Order> findByUser(User user, Pageable pageable);
    
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Order> findByStatus(OrderStatus status);
    
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    
    Page<Order> findByUserAndStatus(User user, OrderStatus status, Pageable pageable);
    
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Long countByUser(User user);
    
    Long countByStatus(OrderStatus status);
    
    Long countByUserAndStatus(User user, OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserId(@Param("userId") String userId);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    Page<Order> findByUserId(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId ORDER BY o.createdAt DESC")
    List<Order> findOrdersByManufacturerId(@Param("manufacturerId") String manufacturerId);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId ORDER BY o.createdAt DESC")
    Page<Order> findOrdersByManufacturerId(@Param("manufacturerId") String manufacturerId, Pageable pageable);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId AND o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findOrdersByManufacturerIdAndStatus(@Param("manufacturerId") String manufacturerId, @Param("status") OrderStatus status);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId AND o.status = :status ORDER BY o.createdAt DESC")
    Page<Order> findOrdersByManufacturerIdAndStatus(@Param("manufacturerId") String manufacturerId, @Param("status") OrderStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId")
    Long countOrdersByManufacturerId(@Param("manufacturerId") String manufacturerId);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.user.id = :userId AND o.status != 'CANCELLED'")
    Double getTotalSpentByUser(@Param("userId") String userId);
    
    @Query("SELECT SUM(o.total) FROM Order o JOIN o.orderItems oi WHERE oi.product.manufacturer.id = :manufacturerId AND o.status = 'DELIVERED'")
    Double getTotalRevenueByManufacturer(@Param("manufacturerId") String manufacturerId);
}

