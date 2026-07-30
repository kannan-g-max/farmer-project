package com.example.farmer_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.farmeragri")
@EntityScan("com.farmeragri.entity")
@EnableJpaRepositories("com.farmeragri.repository")
public class FarmerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmerBackendApplication.class, args);
    }

}
