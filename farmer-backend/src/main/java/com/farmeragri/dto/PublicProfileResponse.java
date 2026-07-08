package com.farmeragri.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String location;
    private String bio;
    private String profileImage;
}
