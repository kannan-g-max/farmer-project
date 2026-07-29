package com.farmeragri.controller;

import com.farmeragri.dto.RiderProfileResponse;
import com.farmeragri.service.RiderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RiderController {

    private final RiderService riderService;

    @GetMapping("/api/rider/{id}/profile")
    public ResponseEntity<RiderProfileResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(riderService.getProfile(id));
    }

    @PutMapping("/api/rider/{id}/profile")
    public ResponseEntity<RiderProfileResponse> updateProfile(@RequestHeader("Authorization") String authorization,
                                                              @PathVariable Long id,
                                                              @RequestBody RiderProfileResponse request) {
        return ResponseEntity.ok(riderService.updateProfile(authorization, id, request));
    }

    @PutMapping("/api/rider/location")
    public ResponseEntity<Void> updateLocation(@RequestHeader("Authorization") String authorization,
                                               @RequestParam("latitude") Double latitude,
                                               @RequestParam("longitude") Double longitude) {
        riderService.updateLocation(authorization, latitude, longitude);
        return ResponseEntity.ok().build();
    }
}
