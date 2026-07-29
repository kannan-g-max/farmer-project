package com.farmeragri.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RiderSigninRequest {
    @NotBlank(message = "Rider ID is required")
    private String riderId;

    @NotBlank(message = "Password is required")
    private String password;
}
