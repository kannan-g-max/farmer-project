package com.example.farmer_backend.mapper;

import com.example.farmer_backend.dto.response.UserResponse;
import com.example.farmer_backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .farmerId(user.getFarmerId())
                .role(user.getRole().name())
                .build();
    }
}
