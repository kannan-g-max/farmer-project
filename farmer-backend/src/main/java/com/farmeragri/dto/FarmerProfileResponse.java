package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FarmerProfileResponse {
    private Long id;
    private String name;
    private String location;
    private Double latitude;
    private Double longitude;
    private Double totalSales;
    private Double rating;
    private String bio;
    private String profileImage;
    private String coverImage;
}
