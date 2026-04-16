package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.request.PublicSigninRequest;
import com.example.farmer_backend.dto.response.SigninResponse;
import com.example.farmer_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/signin")
    public ResponseEntity<SigninResponse> signin(@Valid @RequestBody PublicSigninRequest request) {
        return ResponseEntity.ok(authService.signinPublic(request));
    }
}
