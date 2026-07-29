package com.farmeragri.controller;

import com.farmeragri.dto.FarmerSigninRequest;
import com.farmeragri.dto.PublicSigninRequest;
import com.farmeragri.dto.SigninResponse;
import com.farmeragri.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/farmer/signin")
    public ResponseEntity<SigninResponse> farmerSignin(@Valid @RequestBody FarmerSigninRequest request) {
        return ResponseEntity.ok(authService.signinFarmer(request));
    }

    @PostMapping("/api/public/signin")
    public ResponseEntity<SigninResponse> publicSignin(@Valid @RequestBody PublicSigninRequest request) {
        return ResponseEntity.ok(authService.signinPublic(request));
    }

    @PostMapping("/api/rider/signin")
    public ResponseEntity<SigninResponse> riderSignin(@Valid @RequestBody com.farmeragri.dto.RiderSigninRequest request) {
        return ResponseEntity.ok(authService.signinRider(request));
    }
}
