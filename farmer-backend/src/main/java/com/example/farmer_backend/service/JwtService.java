package com.example.farmer_backend.service;

import com.example.farmer_backend.config.AppProperties;
import com.example.farmer_backend.entity.User;
import com.example.farmer_backend.security.AppUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final AppProperties appProperties;

    public String generateToken(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(user.getId().toString())
                .claims(Map.of("role", user.getRole().name()))
                .issuedAt(new Date(now))
                .expiration(new Date(now + appProperties.getJwt().getExpirationMillis()))
                .signWith(getSigningKey())
                .compact();
    }

    public UUID extractUserId(String token) {
        try {
            return UUID.fromString(extractAllClaims(token).getSubject());
        } catch (Exception ex) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        UUID userId = extractUserId(token);
        return userId != null
                && userDetails instanceof AppUserDetails appUserDetails
                && userId.equals(appUserDetails.getId())
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(appProperties.getJwt().getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
