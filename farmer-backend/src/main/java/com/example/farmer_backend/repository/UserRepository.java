package com.example.farmer_backend.repository;

import com.example.farmer_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByFarmerId(String farmerId);
    boolean existsByEmail(String email);
}
