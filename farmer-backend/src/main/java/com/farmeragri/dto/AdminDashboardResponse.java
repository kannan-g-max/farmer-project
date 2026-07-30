package com.farmeragri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardResponse {
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalFarmers;
    private long activeFarmers;
    private long totalRiders;
    private long activeRiders;
    private long totalUsers;
    private long activeUsers;
    private long totalAdmins;
    private long activeAdmins;
    private long totalOrders;
    private long totalProducts;
}