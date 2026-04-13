package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.ApiResponse;
import com.example.farmer_backend.dto.request.PublicSigninRequest;
import com.example.farmer_backend.dto.request.PublicSignupRequest;
import com.example.farmer_backend.dto.response.SigninResponse;
import com.example.farmer_backend.dto.response.SignupResponse;
import com.example.farmer_backend.service.AuthService;
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
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PublicAuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody PublicSignupRequest request,
                                                              HttpServletRequest httpRequest) {
        SignupResponse response = authService.signupPublicUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", response, httpRequest.getRequestURI()));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<SigninResponse>> signin(@Valid @RequestBody PublicSigninRequest request,
                                                              HttpServletRequest httpRequest) {
        SigninResponse response = authService.signinPublic(request);
        return ResponseEntity.ok(ApiResponse.success("Login Successful", response, httpRequest.getRequestURI()));
    }
}
