package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FarmerProfileResponse {
    private Long id;
    private String name;
    private String location;
    private Double totalSales;
    private Double rating;
    private String bio;
}
