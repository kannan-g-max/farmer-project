package com.farmeragri.service;

import com.farmeragri.dto.ApplicationResponse;
import com.farmeragri.dto.FarmerApplicationRequest;
import com.farmeragri.entity.FarmerApplication;
import com.farmeragri.repository.FarmerApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerApplicationService {

    private final FarmerApplicationRepository farmerApplicationRepository;

    @Transactional
    public ApplicationResponse submitApplication(FarmerApplicationRequest request) {
        farmerApplicationRepository.save(FarmerApplication.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .location(request.getLocation())
                .landPattaNo(request.getLandPattaNo())
                .kisanCardNo(request.getKisanCardNo())
                .coopSocietyNo(request.getCoopSocietyNo())
                .status("PENDING")
                .build());

        return ApplicationResponse.builder()
                .message("Application submitted successfully")
                .build();
    }
}
