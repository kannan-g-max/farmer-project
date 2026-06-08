package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductUploadResponse {
    private String message;
    private Long productId;
}
