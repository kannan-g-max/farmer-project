package com.farmeragri.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerApplicationRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String location;

    @NotBlank
    private String landPattaNo;

    @NotBlank
    private String kisanCardNo;

    @NotBlank
    private String coopSocietyNo;
}
