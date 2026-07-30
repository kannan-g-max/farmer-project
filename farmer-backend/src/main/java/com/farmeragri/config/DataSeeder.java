package com.farmeragri.config;

import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.AdminUser;
import com.farmeragri.entity.Product;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.entity.Rider;
import com.farmeragri.repository.AdminUserRepository;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.repository.RiderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsers(FarmerUserRepository farmerUserRepository,
                                PublicUserRepository publicUserRepository,
                                RiderRepository riderRepository,
                                AdminUserRepository adminUserRepository,
                                ProductRepository productRepository) {
        return args -> {
            if (adminUserRepository.findByAdminId("ADMIN001").isEmpty()) {
                adminUserRepository.save(AdminUser.builder()
                        .adminId("ADMIN001")
                        .email("admin@example.com")
                        .name("System Admin")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role("ADMIN")
                        .active(true)
                        .build());
            }

            FarmerUser farmer;
            if (farmerUserRepository.findByFarmerId("FARM001").isEmpty()) {
                farmer = farmerUserRepository.save(FarmerUser.builder()
                        .farmerId("FARM001")
                        .name("Kannan")
                        .password(passwordEncoder.encode("Farmer@123"))
                        .role("FARMER")
                        .active(true)
                        .location("Madurai, TN")
                        .latitude(9.925201)
                        .longitude(78.119775)
                        .totalSales(0.0)
                        .rating(0.0)
                        .bio("Fresh harvest from my farm")
                        .build());
            } else {
                farmer = farmerUserRepository.findByFarmerId("FARM001").orElseThrow();
            }

            if (publicUserRepository.findByEmail("public@example.com").isEmpty()) {
                publicUserRepository.save(PublicUser.builder()
                        .email("public@example.com")
                        .name("Public User")
                        .password(passwordEncoder.encode("Public@123"))
                        .role("PUBLIC")
                        .active(true)
                        .location("Anna Nagar, Madurai, TN")
                        .latitude(9.880411)
                        .longitude(78.115143)
                        .build());
            }

            if (riderRepository.findByRiderId("RIDER001").isEmpty()) {
                riderRepository.save(Rider.builder()
                        .riderId("RIDER001")
                        .name("Rider User")
                        .password(passwordEncoder.encode("Rider@123"))
                        .role("DELIVERY")
                        .active(true)
                        .location("Simmakkal, Madurai, TN")
                        .latitude(9.924000)
                        .longitude(78.118000)
                        .build());
            }

            if (productRepository.findByFarmerId(farmer.getId()).isEmpty()) {
                productRepository.save(Product.builder()
                        .farmerId(farmer.getId())
                        .name("Fresh Spinach")
                    .quantity(25.0)
                    .unit("kg")
                        .price(25.0)
                    .category("Vegetables")
                        .description("Organic fresh spinach")
                        .imageUrl(null)
                        .build());
            }
        };
    }
}
