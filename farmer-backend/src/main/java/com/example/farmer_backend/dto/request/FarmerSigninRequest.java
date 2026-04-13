package com.example.farmer_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerSigninRequest {

    @NotBlank(message = "Farmer ID is required")
    private String farmerId;

    @NotBlank(message = "Password is required")
    private String password;
}
