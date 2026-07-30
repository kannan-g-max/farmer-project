package com.farmeragri.dto;

import com.farmeragri.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private String buyerLocation;
    private Double buyerLatitude;
    private Double buyerLongitude;
    private Long farmerId;
    private String farmerName;
    private String farmerLocation;
    private Double farmerLatitude;
    private Double farmerLongitude;
    private Long productId;
    private String itemName;
    private Double weight;
    private String unit;
    private Double price;
    private Double totalAmount;
    private String status;
    private Long riderId;
    private String riderName;
    private Double distanceToRider; // Distance from Rider to Farmer (Pickup)
    private Double deliveryPayout;
    private LocalDateTime createdAt;

    public static OrderDTO from(Order order, Double distanceToRider, Double deliveryPayout) {
        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyerId())
                .buyerName(order.getBuyerName())
                .buyerLocation(order.getBuyerLocation())
                .buyerLatitude(order.getBuyerLatitude())
                .buyerLongitude(order.getBuyerLongitude())
                .farmerId(order.getFarmerId())
                .farmerName(order.getFarmerName())
                .farmerLocation(order.getFarmerLocation())
                .farmerLatitude(order.getFarmerLatitude())
                .farmerLongitude(order.getFarmerLongitude())
                .productId(order.getProductId())
                .itemName(order.getItemName())
                .weight(order.getWeight())
                .unit("kg")
                .price(order.getPrice())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .riderId(order.getRiderId())
                .riderName(order.getRiderName())
                .distanceToRider(distanceToRider)
                .deliveryPayout(deliveryPayout)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
