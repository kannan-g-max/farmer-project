package com.farmeragri.service;

import com.farmeragri.dto.AdminAccountResponse;
import com.farmeragri.dto.AdminActionResponse;
import com.farmeragri.dto.AdminDashboardResponse;
import com.farmeragri.dto.AdminFarmerApplicationResponse;
import com.farmeragri.entity.AdminUser;
import com.farmeragri.entity.ApplicationStatus;
import com.farmeragri.entity.FarmerApplication;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.entity.Rider;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.AdminUserRepository;
import com.farmeragri.repository.FarmerApplicationRepository;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.OrderRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.repository.RiderRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminUserRepository adminUserRepository;
    private final FarmerApplicationRepository farmerApplicationRepository;
    private final FarmerUserRepository farmerUserRepository;
    private final PublicUserRepository publicUserRepository;
    private final RiderRepository riderRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminDashboardResponse dashboard(String authorization) {
        requireAdmin(authorization);
        return AdminDashboardResponse.builder()
                .totalApplications(farmerApplicationRepository.count())
                .pendingApplications(farmerApplicationRepository.countByStatus(ApplicationStatus.PENDING.name()))
                .approvedApplications(farmerApplicationRepository.countByStatus(ApplicationStatus.APPROVED.name()))
                .rejectedApplications(farmerApplicationRepository.countByStatus(ApplicationStatus.REJECTED.name()))
                .totalFarmers(farmerUserRepository.count())
                .activeFarmers(countActive(farmerUserRepository.findAll()))
                .totalRiders(riderRepository.count())
                .activeRiders(countActive(riderRepository.findAll()))
                .totalUsers(publicUserRepository.count())
                .activeUsers(countActive(publicUserRepository.findAll()))
                .totalAdmins(adminUserRepository.count())
                .activeAdmins(countActive(adminUserRepository.findAll()))
                .totalOrders(orderRepository.count())
                .totalProducts(productRepository.count())
                .build();
    }

    public List<AdminFarmerApplicationResponse> listApplications(String authorization) {
        requireAdmin(authorization);
        return farmerApplicationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    public AdminFarmerApplicationResponse getApplication(String authorization, Long id) {
        requireAdmin(authorization);
        FarmerApplication application = farmerApplicationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found"));
        return toApplicationResponse(application);
    }

    @Transactional
    public AdminActionResponse approveApplication(String authorization, Long id) {
        requireAdmin(authorization);
        FarmerApplication application = farmerApplicationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!ApplicationStatus.PENDING.name().equals(application.getStatus())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Application is already processed");
        }

        String farmerId = generateFarmerId(application.getId());
        String temporaryPassword = generateTemporaryPassword();

        farmerUserRepository.save(FarmerUser.builder()
                .farmerId(farmerId)
                .name(application.getName())
                .password(passwordEncoder.encode(temporaryPassword))
                .role("FARMER")
                .active(true)
                .phone(application.getPhone())
                .location(application.getLocation())
                .totalSales(0.0)
                .rating(0.0)
                .bio("Approved by admin")
                .build());

        application.setStatus(ApplicationStatus.APPROVED.name());
        farmerApplicationRepository.save(application);

        return AdminActionResponse.builder()
                .message("Application approved and farmer account created")
                .generatedFarmerId(farmerId)
                .temporaryPassword(temporaryPassword)
                .build();
    }

    @Transactional
    public AdminActionResponse rejectApplication(String authorization, Long id) {
        requireAdmin(authorization);
        FarmerApplication application = farmerApplicationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!ApplicationStatus.PENDING.name().equals(application.getStatus())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Application is already processed");
        }

        application.setStatus(ApplicationStatus.REJECTED.name());
        farmerApplicationRepository.save(application);

        return AdminActionResponse.builder()
                .message("Application rejected")
                .build();
    }

    public List<AdminAccountResponse> listFarmers(String authorization) {
        requireAdmin(authorization);
        return farmerUserRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toFarmerResponse).toList();
    }

    public List<AdminAccountResponse> listRiders(String authorization) {
        requireAdmin(authorization);
        return riderRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toRiderResponse).toList();
    }

    public List<AdminAccountResponse> listUsers(String authorization) {
        requireAdmin(authorization);
        return publicUserRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toUserResponse).toList();
    }

    public List<AdminAccountResponse> listAdmins(String authorization) {
        requireAdmin(authorization);
        return adminUserRepository.findAll().stream().map(this::toAdminResponse).toList();
    }

    @Transactional
    public AdminActionResponse setFarmerStatus(String authorization, Long id, Boolean active) {
        requireAdmin(authorization);
        FarmerUser farmer = farmerUserRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Farmer not found"));
        farmer.setActive(active);
        farmerUserRepository.save(farmer);
        return AdminActionResponse.builder().message("Farmer status updated").build();
    }

    @Transactional
    public AdminActionResponse setRiderStatus(String authorization, Long id, Boolean active) {
        requireAdmin(authorization);
        Rider rider = riderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rider not found"));
        rider.setActive(active);
        riderRepository.save(rider);
        return AdminActionResponse.builder().message("Rider status updated").build();
    }

    @Transactional
    public AdminActionResponse setUserStatus(String authorization, Long id, Boolean active) {
        requireAdmin(authorization);
        PublicUser user = publicUserRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setActive(active);
        publicUserRepository.save(user);
        return AdminActionResponse.builder().message("User status updated").build();
    }

    @Transactional
    public AdminActionResponse setAdminStatus(String authorization, Long id, Boolean active) {
        requireAdmin(authorization);
        AdminUser admin = adminUserRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin not found"));
        admin.setActive(active);
        adminUserRepository.save(admin);
        return AdminActionResponse.builder().message("Admin status updated").build();
    }

    private AdminFarmerApplicationResponse toApplicationResponse(FarmerApplication application) {
        return AdminFarmerApplicationResponse.builder()
                .id(application.getId())
                .name(application.getName())
                .phone(application.getPhone())
                .location(application.getLocation())
                .landPattaNo(application.getLandPattaNo())
                .kisanCardNo(application.getKisanCardNo())
                .coopSocietyNo(application.getCoopSocietyNo())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .build();
    }

    private AdminAccountResponse toFarmerResponse(FarmerUser farmer) {
        return AdminAccountResponse.builder()
                .id(farmer.getId())
                .identifier(farmer.getFarmerId())
                .name(farmer.getName())
                .role(farmer.getRole())
                .active(farmer.getActive())
                .phone(farmer.getPhone())
                .location(farmer.getLocation())
                .latitude(farmer.getLatitude())
                .longitude(farmer.getLongitude())
                .createdAt(farmer.getCreatedAt())
                .build();
    }

    private AdminAccountResponse toRiderResponse(Rider rider) {
        return AdminAccountResponse.builder()
                .id(rider.getId())
                .identifier(rider.getRiderId())
                .name(rider.getName())
                .role(rider.getRole())
                .active(rider.getActive())
                .phone(rider.getPhone())
                .location(rider.getLocation())
                .latitude(rider.getLatitude())
                .longitude(rider.getLongitude())
                .createdAt(rider.getCreatedAt())
                .build();
    }

    private AdminAccountResponse toUserResponse(PublicUser user) {
        return AdminAccountResponse.builder()
                .id(user.getId())
                .identifier(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .active(user.getActive())
                .phone(user.getPhone())
                .location(user.getLocation())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AdminAccountResponse toAdminResponse(AdminUser admin) {
        return AdminAccountResponse.builder()
                .id(admin.getId())
                .identifier(admin.getAdminId())
                .name(admin.getName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .active(admin.getActive())
                .createdAt(admin.getCreatedAt())
                .build();
    }

    private void requireAdmin(String authorization) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"ADMIN".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
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

    private String generateFarmerId(Long applicationId) {
        return String.format(Locale.ROOT, "FARM%05d", applicationId);
    }

    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private long countActive(List<?> entities) {
        return entities.stream().filter(entity -> {
            if (entity instanceof FarmerUser farmer) {
                return Boolean.TRUE.equals(farmer.getActive());
            }
            if (entity instanceof Rider rider) {
                return Boolean.TRUE.equals(rider.getActive());
            }
            if (entity instanceof PublicUser user) {
                return Boolean.TRUE.equals(user.getActive());
            }
            if (entity instanceof AdminUser admin) {
                return Boolean.TRUE.equals(admin.getActive());
            }
            return false;
        }).count();
    }
}