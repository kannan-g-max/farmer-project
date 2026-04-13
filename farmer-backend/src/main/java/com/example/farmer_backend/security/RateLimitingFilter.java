package com.example.farmer_backend.security;

import com.example.farmer_backend.config.AppProperties;
import com.example.farmer_backend.exception.ApiException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Map<String, AttemptWindow> ATTEMPTS = new ConcurrentHashMap<>();

    private final AppProperties appProperties;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !(path.equals("/api/public/signin") || path.equals("/api/farmer/signin"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = request.getRequestURI() + ":" + resolveClientKey(request);
        AttemptWindow window = ATTEMPTS.computeIfAbsent(key, ignored -> new AttemptWindow());
        synchronized (window) {
            long now = Instant.now().toEpochMilli();
            long windowMillis = appProperties.getRateLimit().getWindowMillis();
            if (now - window.windowStart >= windowMillis) {
                window.windowStart = now;
                window.count = 0;
            }
            window.count++;
            if (window.count > appProperties.getRateLimit().getMaxAttempts()) {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Too many login attempts. Please try again later");
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class AttemptWindow {
        private long windowStart = Instant.now().toEpochMilli();
        private int count = 0;
    }
}
