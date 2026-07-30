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
@Table(name = "riders")
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String riderId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'DELIVERY'")
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
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (role == null) {
            role = "DELIVERY";
        }
        if (active == null) {
            active = Boolean.TRUE;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
