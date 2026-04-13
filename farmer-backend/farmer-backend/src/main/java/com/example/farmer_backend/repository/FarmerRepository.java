package com.example.farmer_backend.repository;

import com.example.farmer_backend.model.Entity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerRepository extends JpaRepository<Entity, Long> {
}