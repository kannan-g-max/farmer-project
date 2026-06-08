package com.example.farmer_backend.mapper;

import com.example.farmer_backend.dto.response.UserResponse;
import com.example.farmer_backend.entity.User;
import com.example.farmer_backend.entity.UserRole;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public UserResponse toUserResponse(User user) {
        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .role(user.getRole().name());

        if (user.getRole() == UserRole.FARMER) {
            return builder
                    .farmerId(user.getFarmerId())
                    .build();
        }

        return builder
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }
}
