package com.farmeragri.repository;

import com.farmeragri.entity.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Long> {
    Optional<Rider> findByRiderId(String riderId);
    List<Rider> findAllByOrderByCreatedAtDesc();
}
