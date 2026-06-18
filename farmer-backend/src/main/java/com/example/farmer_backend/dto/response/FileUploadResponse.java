package com.example.farmer_backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileUploadResponse {
    private String message;
    private String fileUrl;
    private String filename;
}
