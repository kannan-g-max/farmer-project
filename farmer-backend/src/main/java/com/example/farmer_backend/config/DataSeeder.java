package com.example.farmer_backend.config;

import com.example.farmer_backend.entity.User;
import com.example.farmer_backend.entity.UserRole;
import com.example.farmer_backend.repository.UserRepository;
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
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("public@example.com").isEmpty()) {
                userRepository.save(User.builder()
                        .name("Test Public User")
                        .email("public@example.com")
                        .phone("9876543210")
                        .passwordHash(passwordEncoder.encode("Public@123"))
                        .role(UserRole.PUBLIC)
                        .enabled(true)
                        .build());
            }

            if (userRepository.findByFarmerId("FRM1001").isEmpty()) {
                userRepository.save(User.builder()
                        .name("Test Farmer User")
                        .phone("9123456789")
                        .passwordHash(passwordEncoder.encode("Farmer@123"))
                        .role(UserRole.FARMER)
                        .farmerId("FRM1001")
                        .enabled(true)
                        .build());
            }
        };
    }
}
