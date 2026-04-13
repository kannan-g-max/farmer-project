package com.example.farmer_backend.repository;

import com.example.farmer_backend.entity.FarmerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FarmerApplicationRepository extends JpaRepository<FarmerApplication, UUID> {
}
