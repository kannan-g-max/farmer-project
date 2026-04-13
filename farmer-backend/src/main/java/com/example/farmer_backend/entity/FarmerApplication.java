package com.example.farmer_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "farmer_applications")
public class FarmerApplication {

    @Id
    @UuidGenerator
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(length = 36, nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String landPattaNo;

    @Column(nullable = false)
    private String kisanCardNo;

    @Column(nullable = false)
    private String coopSocietyNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FarmerApplicationStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant reviewedAt;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        if (status == null) {
            status = FarmerApplicationStatus.PENDING;
        }
    }
}
