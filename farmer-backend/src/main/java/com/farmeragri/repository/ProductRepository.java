package com.farmeragri.repository;

import com.farmeragri.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmerId(Long farmerId);
    List<Product> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Product> findByInStockTrueOrderByCreatedAtDesc();
}
