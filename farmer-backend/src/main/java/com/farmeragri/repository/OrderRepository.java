package com.farmeragri.repository;

import com.farmeragri.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByRiderId(Long riderId);
    List<Order> findByStatus(String status);
}
