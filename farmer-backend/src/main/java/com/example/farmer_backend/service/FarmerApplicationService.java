package com.example.farmer_backend.service;

import com.example.farmer_backend.dto.request.FarmerApplicationRequest;
import com.example.farmer_backend.dto.response.FarmerApplicationResponse;
import com.example.farmer_backend.entity.FarmerApplication;
import com.example.farmer_backend.entity.FarmerApplicationStatus;
import com.example.farmer_backend.repository.FarmerApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerApplicationService {

    private final FarmerApplicationRepository farmerApplicationRepository;

    @Transactional
    public FarmerApplicationResponse submitApplication(FarmerApplicationRequest request) {
        FarmerApplication application = farmerApplicationRepository.save(FarmerApplication.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .location(request.getLocation())
                .landPattaNo(request.getLandPattaNo())
                .kisanCardNo(request.getKisanCardNo())
                .coopSocietyNo(request.getCoopSocietyNo())
                .status(FarmerApplicationStatus.PENDING)
                .build());

        return FarmerApplicationResponse.builder()
                .message("Application submitted successfully")
                .applicationId(application.getId())
                .status(application.getStatus().name())
                .build();
    }
}
