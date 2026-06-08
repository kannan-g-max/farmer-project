package com.farmeragri.repository;

import com.farmeragri.entity.FarmerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerApplicationRepository extends JpaRepository<FarmerApplication, Long> {
}
