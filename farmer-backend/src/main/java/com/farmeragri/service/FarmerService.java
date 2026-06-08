package com.farmeragri.service;

import com.farmeragri.dto.FarmerProfileResponse;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerUserRepository farmerUserRepository;

    public FarmerProfileResponse getProfile(Long farmerId) {
        FarmerUser farmer = farmerUserRepository.findById(farmerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Farmer not found"));

        return FarmerProfileResponse.builder()
                .id(farmer.getId())
                .name(farmer.getName())
                .location(farmer.getLocation())
                .totalSales(farmer.getTotalSales())
                .rating(farmer.getRating())
                .bio(farmer.getBio())
                .build();
    }
}
