package com.farmeragri.dto;

import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Product;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.Locale;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDTO {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String imageUrl;
    private String farmerName;
    private String farmerHandle;
    private String distance;

    public static ProductDTO from(Product product, FarmerUser farmer, String distance) {
        return from(product, farmer, distance, product.getImageUrl());
    }

    public static ProductDTO from(Product product, FarmerUser farmer, String distance, String imageUrl) {
        String farmerHandle = null;
        if (farmer != null && farmer.getFarmerId() != null) {
            farmerHandle = "@" + farmer.getFarmerId().toLowerCase(Locale.ROOT);
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(imageUrl)
                .farmerName(farmer == null ? null : farmer.getName())
                .farmerHandle(farmerHandle)
                .distance(distance)
                .build();
    }
}
