package com.farmeragri.repository;

import com.farmeragri.entity.FarmerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmerApplicationRepository extends JpaRepository<FarmerApplication, Long> {
	long countByStatus(String status);
	List<FarmerApplication> findAllByOrderByCreatedAtDesc();
}
