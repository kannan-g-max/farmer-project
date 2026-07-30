package com.farmeragri.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminSigninRequest {
    @NotBlank
    private String adminId;

    @NotBlank
    private String password;
}