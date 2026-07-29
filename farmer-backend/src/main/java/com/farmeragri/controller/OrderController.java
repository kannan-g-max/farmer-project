package com.farmeragri.controller;

import com.farmeragri.dto.OrderDTO;
import com.farmeragri.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<OrderDTO> placeOrder(@RequestHeader("Authorization") String authorization,
                                               @RequestParam("productId") Long productId,
                                               @RequestParam("weight") Double weight) {
        return ResponseEntity.ok(orderService.placeOrder(authorization, productId, weight));
    }

    @GetMapping("/api/public/orders")
    public ResponseEntity<List<OrderDTO>> getBuyerOrders(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(orderService.getBuyerOrders(authorization));
    }

    @GetMapping("/api/rider/gigs")
    public ResponseEntity<List<OrderDTO>> getAvailableGigs(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(orderService.getAvailableGigs(authorization));
    }

    @GetMapping("/api/rider/gigs/active")
    public ResponseEntity<List<OrderDTO>> getRiderActiveGigs(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(orderService.getRiderActiveGigs(authorization));
    }

    @PostMapping("/api/orders/{orderId}/accept")
    public ResponseEntity<OrderDTO> acceptGig(@RequestHeader("Authorization") String authorization,
                                             @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.acceptGig(authorization, orderId));
    }

    @PostMapping("/api/orders/{orderId}/deliver")
    public ResponseEntity<OrderDTO> deliverOrder(@RequestHeader("Authorization") String authorization,
                                                 @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.deliverOrder(authorization, orderId));
    }

    @GetMapping("/api/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> getOrderStatus(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderStatus(orderId));
    }
}
