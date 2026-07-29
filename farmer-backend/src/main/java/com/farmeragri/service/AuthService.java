package com.farmeragri.service;

import com.farmeragri.dto.FarmerSigninRequest;
import com.farmeragri.dto.PublicSigninRequest;
import com.farmeragri.dto.SigninResponse;
import com.farmeragri.dto.UserResponse;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FarmerUserRepository farmerUserRepository;
    private final PublicUserRepository publicUserRepository;
    private final com.farmeragri.repository.RiderRepository riderRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public SigninResponse signinRider(com.farmeragri.dto.RiderSigninRequest request) {
        com.farmeragri.entity.Rider rider = riderRepository.findByRiderId(request.getRiderId())
                .filter(com.farmeragri.entity.Rider::getActive)
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid rider ID or password"));

        return SigninResponse.builder()
                .token(jwtService.generateToken(rider.getRiderId(), rider.getId(), rider.getRole()))
                .user(UserResponse.builder()
                        .id(rider.getId())
                        .riderId(rider.getRiderId())
                        .name(rider.getName())
                        .role(rider.getRole())
                        .build())
                .message("Login successful")
                .build();
    }

    public SigninResponse signinFarmer(FarmerSigninRequest request) {
        FarmerUser farmer = farmerUserRepository.findByFarmerId(request.getFarmerId())
                .filter(FarmerUser::getActive)
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid farmer ID or password"));

        return SigninResponse.builder()
                .token(jwtService.generateToken(farmer.getFarmerId(), farmer.getId(), farmer.getRole()))
                .user(UserResponse.builder()
                        .id(farmer.getId())
                        .farmerId(farmer.getFarmerId())
                        .name(farmer.getName())
                        .role(farmer.getRole())
                        .build())
                .message("Login successful")
                .build();
    }

    public SigninResponse signinPublic(PublicSigninRequest request) {
        PublicUser publicUser = publicUserRepository.findByEmail(request.getEmail())
                .filter(PublicUser::getActive)
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        return SigninResponse.builder()
                .token(jwtService.generateToken(publicUser.getEmail(), publicUser.getId(), publicUser.getRole()))
                .user(UserResponse.builder()
                        .id(publicUser.getId())
                        .email(publicUser.getEmail())
                        .name(publicUser.getName())
                        .role(publicUser.getRole())
                        .build())
                .message("Login successful")
                .build();
    }
}
