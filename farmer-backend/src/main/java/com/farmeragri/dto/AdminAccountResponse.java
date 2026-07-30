package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminAccountResponse {
    private Long id;
    private String identifier;
    private String name;
    private String email;
    private String role;
    private Boolean active;
    private String phone;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}