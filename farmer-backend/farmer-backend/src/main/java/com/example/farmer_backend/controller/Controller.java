package com.example.farmer_backend.controller;

import com.example.farmer_backend.repository.FarmerRepository;
import com.example.farmer_backend.model.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private FarmerRepository farmerRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForVerification(@RequestBody Entity farmerdata) {
        farmerRepository.save(farmerdata);
        return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
    }
}