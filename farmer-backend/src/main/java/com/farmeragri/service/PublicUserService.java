package com.farmeragri.service;

import com.farmeragri.dto.PublicProfileResponse;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublicUserService {

    private final PublicUserRepository publicUserRepository;
    private final JwtService jwtService;

    public PublicProfileResponse getProfile(Long userId) {
        PublicUser user = publicUserRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return toResponse(user);
    }

    @Transactional
    public PublicProfileResponse updateProfile(String authorization, Long userId, PublicProfileResponse request) {
        Claims claims = claimsFromAuthorization(authorization);
        Long claimsUserId = Long.valueOf(String.valueOf(claims.get("userId")));
        if (!claimsUserId.equals(userId) || !"PUBLIC".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        PublicUser user = publicUserRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim());
        }
        if (request.getLatitude() != null) {
            user.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            user.setLongitude(request.getLongitude());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        return toResponse(publicUserRepository.save(user));
    }

    private PublicProfileResponse toResponse(PublicUser user) {
        return PublicProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .location(user.getLocation())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
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
