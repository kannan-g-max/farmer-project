package com.example.farmer_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerApplicationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\d{10,15}$", message = "Phone must be 10 to 15 digits")
    private String phone;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Land patta number is required")
    private String landPattaNo;

    @NotBlank(message = "Kisan card number is required")
    private String kisanCardNo;

    @NotBlank(message = "Cooperative society number is required")
    private String coopSocietyNo;
}
