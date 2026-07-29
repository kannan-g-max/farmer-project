package com.farmeragri.service;

import com.farmeragri.dto.OrderDTO;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Order;
import com.farmeragri.entity.Product;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.entity.Rider;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.OrderRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.repository.RiderRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PublicUserRepository publicUserRepository;
    private final FarmerUserRepository farmerUserRepository;
    private final RiderRepository riderRepository;
    private final JwtService jwtService;

    @Transactional
    public OrderDTO placeOrder(String authorization, Long productId, Double weight) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"PUBLIC".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only public users can place orders");
        }
        Long buyerId = Long.valueOf(String.valueOf(claims.get("userId")));
        PublicUser buyer = publicUserRepository.findById(buyerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        FarmerUser farmer = farmerUserRepository.findById(product.getFarmerId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Farmer not found"));

        if (weight == null || weight <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid weight quantity");
        }

        Double totalAmount = product.getPrice() * weight;

        Order order = orderRepository.save(Order.builder()
                .buyerId(buyerId)
                .buyerName(buyer.getName())
                .buyerLocation(buyer.getLocation())
            .buyerLatitude(resolveBuyerLatitude(buyer))
            .buyerLongitude(resolveBuyerLongitude(buyer))
                .farmerId(farmer.getId())
                .farmerName(farmer.getName())
                .farmerLocation(farmer.getLocation())
            .farmerLatitude(resolveFarmerLatitude(farmer))
            .farmerLongitude(resolveFarmerLongitude(farmer))
                .productId(productId)
                .itemName(product.getName())
                .weight(weight)
                .price(product.getPrice())
                .totalAmount(totalAmount)
                .status("PENDING")
                .build());

        return toOrderDto(order, null);
    }

    public List<OrderDTO> getBuyerOrders(String authorization) {
        Claims claims = claimsFromAuthorization(authorization);
        Long buyerId = Long.valueOf(String.valueOf(claims.get("userId")));
        return orderRepository.findByBuyerId(buyerId).stream()
            .map(order -> toOrderDto(order, null))
                .toList();
    }

    public List<OrderDTO> getAvailableGigs(String authorization) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"DELIVERY".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        Long riderId = Long.valueOf(String.valueOf(claims.get("userId")));
        Rider rider = riderRepository.findById(riderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));

        List<Order> pendingOrders = orderRepository.findByStatus("PENDING");
        List<OrderDTO> gigs = new ArrayList<>();

        for (Order order : pendingOrders) {
            Double distanceToRider = null;
            Double farmerLatitude = resolveFarmerLatitude(order);
            Double farmerLongitude = resolveFarmerLongitude(order);
            if (rider.getLatitude() != null && rider.getLongitude() != null &&
                farmerLatitude != null && farmerLongitude != null) {
                
                distanceToRider = calculateDistance(
                        rider.getLatitude(), rider.getLongitude(),
                        farmerLatitude, farmerLongitude
                );

                // Filter within 50 km radius
                if (distanceToRider > 50.0) {
                    continue;
                }
            }

                gigs.add(toOrderDto(order, distanceToRider));
        }

        return gigs;
    }

    public List<OrderDTO> getRiderActiveGigs(String authorization) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"DELIVERY".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        Long riderId = Long.valueOf(String.valueOf(claims.get("userId")));
        Rider rider = riderRepository.findById(riderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));

        return orderRepository.findByRiderId(riderId).stream()
                .map(order -> {
                    Double dist = null;
                    Double farmerLatitude = resolveFarmerLatitude(order);
                    Double farmerLongitude = resolveFarmerLongitude(order);
                    if (rider.getLatitude() != null && rider.getLongitude() != null &&
                        farmerLatitude != null && farmerLongitude != null) {
                        dist = calculateDistance(rider.getLatitude(), rider.getLongitude(), farmerLatitude, farmerLongitude);
                    }
                    return toOrderDto(order, dist);
                })
                .toList();
    }

    @Transactional
    public OrderDTO acceptGig(String authorization, Long orderId) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"DELIVERY".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        Long riderId = Long.valueOf(String.valueOf(claims.get("userId")));
        Rider rider = riderRepository.findById(riderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!"PENDING".equals(order.getStatus())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Order is already accepted or delivered");
        }

        order.setStatus("ACCEPTED");
        order.setRiderId(riderId);
        order.setRiderName(rider.getName());
        Order saved = orderRepository.save(order);

        Double dist = null;
        Double farmerLatitude = resolveFarmerLatitude(saved);
        Double farmerLongitude = resolveFarmerLongitude(saved);
        if (rider.getLatitude() != null && rider.getLongitude() != null &&
            farmerLatitude != null && farmerLongitude != null) {
            dist = calculateDistance(rider.getLatitude(), rider.getLongitude(), farmerLatitude, farmerLongitude);
        }
        return toOrderDto(saved, dist);
    }

    @Transactional
    public OrderDTO deliverOrder(String authorization, Long orderId) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"DELIVERY".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        Long riderId = Long.valueOf(String.valueOf(claims.get("userId")));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!Objects.equals(order.getRiderId(), riderId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot deliver an order assigned to another rider");
        }

        order.setStatus("DELIVERED");
        Order saved = orderRepository.save(order);

        return toOrderDto(saved, 0.0);
    }

    public OrderDTO getOrderStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        return toOrderDto(order, null);
    }

    private OrderDTO toOrderDto(Order order, Double distanceToRider) {
        Double farmerLatitude = resolveFarmerLatitude(order);
        Double farmerLongitude = resolveFarmerLongitude(order);
        Double buyerLatitude = resolveBuyerLatitude(order);
        Double buyerLongitude = resolveBuyerLongitude(order);
        Double deliveryPayout = calculatePayout(farmerLatitude, farmerLongitude, buyerLatitude, buyerLongitude);

        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyerId())
                .buyerName(order.getBuyerName())
                .buyerLocation(order.getBuyerLocation())
                .buyerLatitude(buyerLatitude)
                .buyerLongitude(buyerLongitude)
                .farmerId(order.getFarmerId())
                .farmerName(order.getFarmerName())
                .farmerLocation(order.getFarmerLocation())
                .farmerLatitude(farmerLatitude)
                .farmerLongitude(farmerLongitude)
                .productId(order.getProductId())
                .itemName(order.getItemName())
                .weight(order.getWeight())
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

    private Double resolveBuyerLatitude(Order order) {
        if (isValidCoordinate(order.getBuyerLatitude())) {
            return order.getBuyerLatitude();
        }

        PublicUser buyer = publicUserRepository.findById(order.getBuyerId()).orElse(null);
        if (buyer == null || !isValidCoordinate(buyer.getLatitude())) {
            return null;
        }
        return buyer.getLatitude();
    }

    private Double resolveBuyerLongitude(Order order) {
        if (isValidCoordinate(order.getBuyerLongitude())) {
            return order.getBuyerLongitude();
        }

        PublicUser buyer = publicUserRepository.findById(order.getBuyerId()).orElse(null);
        if (buyer == null || !isValidCoordinate(buyer.getLongitude())) {
            return null;
        }
        return buyer.getLongitude();
    }

    private Double resolveFarmerLatitude(Order order) {
        if (isValidCoordinate(order.getFarmerLatitude())) {
            return order.getFarmerLatitude();
        }

        FarmerUser farmer = farmerUserRepository.findById(order.getFarmerId()).orElse(null);
        if (farmer == null || !isValidCoordinate(farmer.getLatitude())) {
            return null;
        }
        return farmer.getLatitude();
    }

    private Double resolveFarmerLongitude(Order order) {
        if (isValidCoordinate(order.getFarmerLongitude())) {
            return order.getFarmerLongitude();
        }

        FarmerUser farmer = farmerUserRepository.findById(order.getFarmerId()).orElse(null);
        if (farmer == null || !isValidCoordinate(farmer.getLongitude())) {
            return null;
        }
        return farmer.getLongitude();
    }

    private Double resolveBuyerLatitude(PublicUser buyer) {
        return isValidCoordinate(buyer.getLatitude()) ? buyer.getLatitude() : null;
    }

    private Double resolveBuyerLongitude(PublicUser buyer) {
        return isValidCoordinate(buyer.getLongitude()) ? buyer.getLongitude() : null;
    }

    private Double resolveFarmerLatitude(FarmerUser farmer) {
        return isValidCoordinate(farmer.getLatitude()) ? farmer.getLatitude() : null;
    }

    private Double resolveFarmerLongitude(FarmerUser farmer) {
        return isValidCoordinate(farmer.getLongitude()) ? farmer.getLongitude() : null;
    }

    private boolean isValidCoordinate(Double coordinate) {
        return coordinate != null && coordinate != 0.0d;
    }

    private Double calculatePayout(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 50.0;
        }
        double dist = calculateDistance(lat1, lon1, lat2, lon2);
        return Math.max(50.0, 50.0 + dist * 10.0);
    }

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Claims claimsFromAuthorization(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        try {
            return jwtService.parseClaims(authorization.substring(7));
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }
}
