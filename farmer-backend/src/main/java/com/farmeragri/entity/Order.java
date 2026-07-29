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
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long buyerId;

    @Column(nullable = false)
    private String buyerName;

    @Column
    private String buyerLocation;

    @Column
    private Double buyerLatitude;

    @Column
    private Double buyerLongitude;

    @Column(nullable = false)
    private Long farmerId;

    @Column(nullable = false)
    private String farmerName;

    @Column
    private String farmerLocation;

    @Column
    private Double farmerLatitude;

    @Column
    private Double farmerLongitude;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false, columnDefinition = "VARCHAR(30) DEFAULT 'PENDING'")
    private String status;

    @Column
    private Long riderId;

    @Column
    private String riderName;

    @Column
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = "PENDING";
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
