package com.example.farmer_backend;

import com.example.farmer_backend.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class FarmerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmerBackendApplication.class, args);
    }

}
