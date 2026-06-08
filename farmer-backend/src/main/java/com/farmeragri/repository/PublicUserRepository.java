package com.farmeragri.repository;

import com.farmeragri.entity.PublicUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PublicUserRepository extends JpaRepository<PublicUser, Long> {
    Optional<PublicUser> findByEmail(String email);
}
