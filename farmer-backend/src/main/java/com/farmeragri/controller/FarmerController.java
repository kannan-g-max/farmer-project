package com.farmeragri.controller;

import com.farmeragri.dto.ApplicationResponse;
import com.farmeragri.dto.FarmerApplicationRequest;
import com.farmeragri.dto.FarmerProfileResponse;
import com.farmeragri.dto.FileUploadResponse;
import com.farmeragri.service.FarmerApplicationService;
import com.farmeragri.service.FarmerService;
import com.farmeragri.service.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerApplicationService farmerApplicationService;
    private final FileStorageService fileStorageService;
    private final FarmerService farmerService;

    @PostMapping("/api/farmer/apply")
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody FarmerApplicationRequest request) {
        return ResponseEntity.ok(farmerApplicationService.submitApplication(request));
    }

    @GetMapping("/api/farmer/{farmerId}/profile")
    public ResponseEntity<FarmerProfileResponse> profile(@PathVariable Long farmerId) {
        return ResponseEntity.ok(farmerService.getProfile(farmerId));
    }

    @PutMapping("/api/farmer/{farmerId}/profile")
    public ResponseEntity<FarmerProfileResponse> updateProfile(@RequestHeader("Authorization") String authorization,
                                                               @PathVariable Long farmerId,
                                                               @RequestBody FarmerProfileResponse request) {
        return ResponseEntity.ok(farmerService.updateProfile(authorization, farmerId, request));
    }

    @PostMapping("/api/farmer/upload")
    public ResponseEntity<FileUploadResponse> upload(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fileStorageService.storeImage(image));
    }
}
