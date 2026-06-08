package com.farmeragri.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerSigninRequest {
    @NotBlank
    private String farmerId;

    @NotBlank
    private String password;
}
