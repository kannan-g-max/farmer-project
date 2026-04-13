package com.example.farmer_backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class ApiResponse<T> {
    private final String message;
    private final T data;
    private final Instant timestamp;
    private final String path;

    public static <T> ApiResponse<T> success(String message, T data, String path) {
        return ApiResponse.<T>builder()
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .path(path)
                .build();
    }
}
