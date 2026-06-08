package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.request.FarmerApplicationRequest;
import com.example.farmer_backend.dto.request.FarmerSigninRequest;
import com.example.farmer_backend.dto.response.FileUploadResponse;
import com.example.farmer_backend.dto.response.FarmerApplicationResponse;
import com.example.farmer_backend.dto.response.SigninResponse;
import com.example.farmer_backend.service.AuthService;
import com.example.farmer_backend.service.FileUploadService;
import com.example.farmer_backend.service.FarmerApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FarmerAuthController {

    private final AuthService authService;
    private final FarmerApplicationService farmerApplicationService;
    private final FileUploadService fileUploadService;

    @PostMapping("/signin")
    public ResponseEntity<SigninResponse> farmerSignin(@Valid @RequestBody FarmerSigninRequest request) {
        return ResponseEntity.ok(authService.signinFarmer(request));
    }

    @PostMapping("/apply")
    public ResponseEntity<FarmerApplicationResponse> apply(@Valid @RequestBody FarmerApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(farmerApplicationService.submitApplication(request));
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(@RequestParam("image") MultipartFile image,
                                                     Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fileUploadService.uploadImage(image, authentication));
    }
}
