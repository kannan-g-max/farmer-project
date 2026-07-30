package com.farmeragri.repository;

import com.farmeragri.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByRiderId(Long riderId);
    List<Order> findByRiderIdAndStatusIn(Long riderId, List<String> statuses);
    List<Order> findByStatus(String status);
    Optional<Order> findByIdAndStatus(Long id, String status);
}
