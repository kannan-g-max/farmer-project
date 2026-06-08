package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileUploadResponse {
    private String message;
    private String fileUrl;
    private String filename;
}
