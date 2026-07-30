package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminActionResponse {
    private String message;
    private String generatedFarmerId;
    private String temporaryPassword;
}