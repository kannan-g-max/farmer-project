package com.example.farmer_backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SigninResponse {
    private String token;
    private UserResponse user;
}
