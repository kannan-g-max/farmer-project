package com.farmeragri.service;

import com.farmeragri.dto.FarmerProfileResponse;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerUserRepository farmerUserRepository;
    private final JwtService jwtService;

    public FarmerProfileResponse getProfile(Long farmerId) {
        FarmerUser farmer = farmerUserRepository.findById(farmerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Farmer not found"));

        return FarmerProfileResponse.builder()
                .id(farmer.getId())
                .name(farmer.getName())
                .location(farmer.getLocation())
                .latitude(farmer.getLatitude())
                .longitude(farmer.getLongitude())
                .totalSales(farmer.getTotalSales())
                .rating(farmer.getRating())
                .bio(farmer.getBio())
                .profileImage(farmer.getProfileImage())
                .coverImage(farmer.getCoverImage())
                .build();
    }

    @Transactional
    public FarmerProfileResponse updateProfile(String authorization, Long farmerId, FarmerProfileResponse request) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        Claims claims;
        try {
            claims = jwtService.parseClaims(authorization.substring(7));
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Long tokenUserId = Long.valueOf(String.valueOf(claims.get("userId")));
        if (!"FARMER".equals(String.valueOf(claims.get("role"))) || !tokenUserId.equals(farmerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        FarmerUser farmer = farmerUserRepository.findById(farmerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Farmer not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            farmer.setName(request.getName().trim());
        }
        if (request.getBio() != null) {
            farmer.setBio(request.getBio().trim());
        }
        if (request.getLocation() != null) {
            farmer.setLocation(request.getLocation().trim());
        }
        if (request.getLatitude() != null) {
            farmer.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            farmer.setLongitude(request.getLongitude());
        }
        if (request.getProfileImage() != null) {
            farmer.setProfileImage(request.getProfileImage());
        }
        if (request.getCoverImage() != null) {
            farmer.setCoverImage(request.getCoverImage());
        }

        FarmerUser saved = farmerUserRepository.save(farmer);
        return FarmerProfileResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .location(saved.getLocation())
                .latitude(saved.getLatitude())
                .longitude(saved.getLongitude())
                .totalSales(saved.getTotalSales())
                .rating(saved.getRating())
                .bio(saved.getBio())
                .profileImage(saved.getProfileImage())
                .coverImage(saved.getCoverImage())
                .build();
    }
}
