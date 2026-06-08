package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SigninResponse {
    private String token;
    private UserResponse user;
    private String message;
}
