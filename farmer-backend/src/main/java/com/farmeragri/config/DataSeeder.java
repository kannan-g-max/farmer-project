package com.farmeragri.config;

import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Product;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.repository.PublicUserRepository;
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
                                ProductRepository productRepository) {
        return args -> {
            FarmerUser farmer;
            if (farmerUserRepository.findByFarmerId("FARM001").isEmpty()) {
                farmer = farmerUserRepository.save(FarmerUser.builder()
                        .farmerId("FARM001")
                        .name("Kannan")
                        .password(passwordEncoder.encode("Farmer@123"))
                        .role("FARMER")
                        .active(true)
                        .location("Madurai, TN")
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
                        .build());
            }

            if (productRepository.findByFarmerId(farmer.getId()).isEmpty()) {
                productRepository.save(Product.builder()
                        .farmerId(farmer.getId())
                        .name("Fresh Spinach")
                        .price(25.0)
                        .description("Organic fresh spinach")
                        .imageUrl(null)
                        .build());
            }
        };
    }
}
