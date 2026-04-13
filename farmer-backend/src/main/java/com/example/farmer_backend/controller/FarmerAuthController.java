package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.ApiResponse;
import com.example.farmer_backend.dto.request.FarmerApplicationRequest;
import com.example.farmer_backend.dto.request.FarmerSigninRequest;
import com.example.farmer_backend.dto.response.FarmerApplicationResponse;
import com.example.farmer_backend.dto.response.SigninResponse;
import com.example.farmer_backend.service.AuthService;
import com.example.farmer_backend.service.FarmerApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FarmerAuthController {

    private final AuthService authService;
    private final FarmerApplicationService farmerApplicationService;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<SigninResponse>> farmerSignin(@Valid @RequestBody FarmerSigninRequest request,
                                                                    HttpServletRequest httpRequest) {
        SigninResponse response = authService.signinFarmer(request);
        return ResponseEntity.ok(ApiResponse.success("Login Successful", response, httpRequest.getRequestURI()));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<FarmerApplicationResponse>> apply(@Valid @RequestBody FarmerApplicationRequest request,
                                                                        HttpServletRequest httpRequest) {
        FarmerApplicationResponse response = farmerApplicationService.submitApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response, httpRequest.getRequestURI()));
    }
}
