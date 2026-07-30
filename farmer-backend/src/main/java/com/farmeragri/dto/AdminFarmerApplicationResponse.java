package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminFarmerApplicationResponse {
    private Long id;
    private String name;
    private String phone;
    private String location;
    private String landPattaNo;
    private String kisanCardNo;
    private String coopSocietyNo;
    private String status;
    private LocalDateTime createdAt;
}