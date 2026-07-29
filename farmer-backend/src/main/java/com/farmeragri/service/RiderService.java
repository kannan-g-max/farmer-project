package com.farmeragri.service;

import com.farmeragri.dto.RiderProfileResponse;
import com.farmeragri.entity.Rider;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.RiderRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RiderService {

    private final RiderRepository riderRepository;
    private final JwtService jwtService;

    public RiderProfileResponse getProfile(Long id) {
        Rider rider = riderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));
        return toResponse(rider);
    }

    @Transactional
    public RiderProfileResponse updateProfile(String authorization, Long id, RiderProfileResponse request) {
        Claims claims = claimsFromAuthorization(authorization);
        Long tokenUserId = Long.valueOf(String.valueOf(claims.get("userId")));
        if (!"DELIVERY".equals(String.valueOf(claims.get("role"))) || !tokenUserId.equals(id)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Rider rider = riderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            rider.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            rider.setPhone(request.getPhone().trim());
        }
        if (request.getLocation() != null) {
            rider.setLocation(request.getLocation().trim());
        }
        if (request.getLatitude() != null) {
            rider.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            rider.setLongitude(request.getLongitude());
        }

        Rider saved = riderRepository.save(rider);
        return toResponse(saved);
    }

    @Transactional
    public void updateLocation(String authorization, Double latitude, Double longitude) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"DELIVERY".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Long riderId = Long.valueOf(String.valueOf(claims.get("userId")));
        Rider rider = riderRepository.findById(riderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));

        rider.setLatitude(latitude);
        rider.setLongitude(longitude);
        riderRepository.save(rider);
    }

    private RiderProfileResponse toResponse(Rider rider) {
        return RiderProfileResponse.builder()
                .id(rider.getId())
                .riderId(rider.getRiderId())
                .name(rider.getName())
                .phone(rider.getPhone())
                .location(rider.getLocation())
                .latitude(rider.getLatitude())
                .longitude(rider.getLongitude())
                .build();
    }

    private Claims claimsFromAuthorization(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        try {
            return jwtService.parseClaims(authorization.substring(7));
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }
}
