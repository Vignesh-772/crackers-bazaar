package com.crackersbazaar.repository;

import com.crackersbazaar.entity.Order;
import com.crackersbazaar.entity.OrderItem;
import com.crackersbazaar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    
    List<OrderItem> findByOrder(Order order);
    
    List<OrderItem> findByProduct(Product product);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.id = :userId")
    List<OrderItem> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.manufacturer.id = :manufacturerId")
    List<OrderItem> findByManufacturerId(@Param("manufacturerId") Long manufacturerId);
    
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Long getTotalQuantitySoldByProduct(@Param("productId") Long productId);
    
    @Query("SELECT SUM(oi.totalPrice) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.status = 'DELIVERED'")
    Double getTotalRevenueByProduct(@Param("productId") Long productId);
}

