package com.farmeragri.controller;

import com.farmeragri.dto.AdminActionResponse;
import com.farmeragri.dto.AdminAccountResponse;
import com.farmeragri.dto.AdminDashboardResponse;
import com.farmeragri.dto.AdminFarmerApplicationResponse;
import com.farmeragri.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/api/admin/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.dashboard(authorization));
    }

    @GetMapping("/api/admin/farmer-applications")
    public ResponseEntity<List<AdminFarmerApplicationResponse>> applications(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.listApplications(authorization));
    }

    @GetMapping("/api/admin/farmer-applications/{id}")
    public ResponseEntity<AdminFarmerApplicationResponse> application(@RequestHeader("Authorization") String authorization,
                                                                       @PathVariable Long id) {
        return ResponseEntity.ok(adminService.getApplication(authorization, id));
    }

    @PostMapping("/api/admin/farmer-applications/{id}/approve")
    public ResponseEntity<AdminActionResponse> approve(@RequestHeader("Authorization") String authorization,
                                                       @PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveApplication(authorization, id));
    }

    @PostMapping("/api/admin/farmer-applications/{id}/reject")
    public ResponseEntity<AdminActionResponse> reject(@RequestHeader("Authorization") String authorization,
                                                       @PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectApplication(authorization, id));
    }

    @GetMapping("/api/admin/farmers")
    public ResponseEntity<List<AdminAccountResponse>> farmers(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.listFarmers(authorization));
    }

    @GetMapping("/api/admin/riders")
    public ResponseEntity<List<AdminAccountResponse>> riders(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.listRiders(authorization));
    }

    @GetMapping("/api/admin/users")
    public ResponseEntity<List<AdminAccountResponse>> users(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.listUsers(authorization));
    }

    @GetMapping("/api/admin/admins")
    public ResponseEntity<List<AdminAccountResponse>> admins(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(adminService.listAdmins(authorization));
    }

    @PutMapping("/api/admin/farmers/{id}/status")
    public ResponseEntity<AdminActionResponse> farmerStatus(@RequestHeader("Authorization") String authorization,
                                                            @PathVariable Long id,
                                                            @RequestParam Boolean active) {
        return ResponseEntity.ok(adminService.setFarmerStatus(authorization, id, active));
    }

    @PutMapping("/api/admin/riders/{id}/status")
    public ResponseEntity<AdminActionResponse> riderStatus(@RequestHeader("Authorization") String authorization,
                                                            @PathVariable Long id,
                                                            @RequestParam Boolean active) {
        return ResponseEntity.ok(adminService.setRiderStatus(authorization, id, active));
    }

    @PutMapping("/api/admin/users/{id}/status")
    public ResponseEntity<AdminActionResponse> userStatus(@RequestHeader("Authorization") String authorization,
                                                          @PathVariable Long id,
                                                          @RequestParam Boolean active) {
        return ResponseEntity.ok(adminService.setUserStatus(authorization, id, active));
    }

    @PutMapping("/api/admin/admins/{id}/status")
    public ResponseEntity<AdminActionResponse> adminStatus(@RequestHeader("Authorization") String authorization,
                                                           @PathVariable Long id,
                                                           @RequestParam Boolean active) {
        return ResponseEntity.ok(adminService.setAdminStatus(authorization, id, active));
    }
}