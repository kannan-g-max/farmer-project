package com.farmeragri.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiderProfileResponse {
    private Long id;
    private String riderId;
    private String name;
    private String phone;
    private String location;
    private Double latitude;
    private Double longitude;
}
