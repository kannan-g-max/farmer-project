package com.example.farmer_backend.service;

import com.example.farmer_backend.dto.request.FarmerSigninRequest;
import com.example.farmer_backend.dto.request.PublicSigninRequest;
import com.example.farmer_backend.dto.request.PublicSignupRequest;
import com.example.farmer_backend.dto.response.SigninResponse;
import com.example.farmer_backend.dto.response.SignupResponse;
import com.example.farmer_backend.entity.User;
import com.example.farmer_backend.entity.UserRole;
import com.example.farmer_backend.exception.ApiException;
import com.example.farmer_backend.mapper.AuthMapper;
import com.example.farmer_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    @Transactional
    public SignupResponse signupPublicUser(PublicSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = userRepository.save(User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.PUBLIC)
                .enabled(true)
                .build());

        return SignupResponse.builder()
                .userId(user.getId())
                .build();
    }

    public SigninResponse signinPublic(PublicSigninRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .filter(existingUser -> existingUser.getRole() == UserRole.PUBLIC)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        return authenticateAndBuildResponse(request.getEmail(), request.getPassword(), user);
    }

    public SigninResponse signinFarmer(FarmerSigninRequest request) {
        User user = userRepository.findByFarmerId(request.getFarmerId())
                .filter(existingUser -> existingUser.getRole() == UserRole.FARMER)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        return authenticateAndBuildResponse(request.getFarmerId(), request.getPassword(), user);
    }

    private SigninResponse authenticateAndBuildResponse(String principal, String password, User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(principal, password)
        );
        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return SigninResponse.builder()
                .token(jwtService.generateToken(user))
                .user(authMapper.toUserResponse(user))
                .build();
    }
}
