package com.example.farmer_backend.controller;

import com.example.farmer_backend.model.Farmer;
import com.example.farmer_backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerController {

    @Autowired
    private FarmerRepository farmerRepository;

    // 1. Farmer Registration (Request Verification)
    @PostMapping("/apply")
    public Farmer applyFarmer(@RequestBody Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    // 2. Get All Farmers (Admin dashboard-ku venum)
    @GetMapping("/all")
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    // 3. Approve Farmer & Generate ID/Password
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveFarmer(@PathVariable Long id) {
        return farmerRepository.findById(id).map(farmer -> {
            // Logic to generate random ID and Password
            String generatedId = "FRM" + (int)(Math.random() * 10000);
            String generatedPwd = "PWD" + (int)(Math.random() * 9000);

            farmer.setFarmerId(generatedId);
            farmer.setPassword(generatedPwd);
            farmer.setStatus("APPROVED");

            farmerRepository.save(farmer);
            return ResponseEntity.ok("Farmer Approved! ID: " + generatedId + ", Password: " + generatedPwd);
        }).orElse(ResponseEntity.notFound().build());
    }
}