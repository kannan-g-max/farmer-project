package com.farmeragri.repository;

import com.farmeragri.entity.FarmerUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FarmerUserRepository extends JpaRepository<FarmerUser, Long> {
    Optional<FarmerUser> findByFarmerId(String farmerId);
    List<FarmerUser> findAllByOrderByCreatedAtDesc();
}
