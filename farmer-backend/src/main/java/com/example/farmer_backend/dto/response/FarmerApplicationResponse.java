package com.example.farmer_backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class FarmerApplicationResponse {
    private UUID applicationId;
    private String status;
}
