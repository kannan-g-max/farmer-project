package com.farmeragri.controller;

import com.farmeragri.dto.PublicProfileResponse;
import com.farmeragri.service.PublicUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PublicUserController {

    @Autowired
    private PublicUserService publicUserService;

    @GetMapping("/api/public/{userId}/profile")
    public ResponseEntity<PublicProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(publicUserService.getProfile(userId));
    }

    @PutMapping("/api/public/{userId}/profile")
    public ResponseEntity<PublicProfileResponse> updateProfile(@RequestHeader("Authorization") String authorization,
                                                               @PathVariable Long userId,
                                                               @RequestBody PublicProfileResponse request) {
        return ResponseEntity.ok(publicUserService.updateProfile(authorization, userId, request));
    }
}
