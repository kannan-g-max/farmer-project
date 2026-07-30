package com.farmeragri.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "farmer_users")
public class FarmerUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String farmerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'FARMER'")
    private String role;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean active;

    @Column
    private String phone;

    @Column
    private String location;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private Double totalSales;

    @Column
    private Double rating;

    @Column
    private String bio;

    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    @Column(columnDefinition = "LONGTEXT")
    private String coverImage;

    @Column
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (role == null) {
            role = "FARMER";
        }
        if (active == null) {
            active = Boolean.TRUE;
        }
        if (totalSales == null) {
            totalSales = 0.0;
        }
        if (rating == null) {
            rating = 0.0;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
