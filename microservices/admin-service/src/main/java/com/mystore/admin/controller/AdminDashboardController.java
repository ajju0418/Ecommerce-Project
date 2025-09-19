package com.mystore.admin.controller;

import com.mystore.admin.client.OrderServiceClient;
import com.mystore.admin.dto.ProductDto;
import com.mystore.admin.service.AdminOrderService;
import com.mystore.admin.service.AdminProductService;
import com.mystore.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminProductService adminProductService;

    @Autowired
    private AdminOrderService adminOrderService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        try {
            // Admin stats
            long activeAdmins = adminService.getActiveAdminCount();
            overview.put("activeAdmins", activeAdmins);
            
            // Order stats
            OrderServiceClient.OrderSummaryDto orderSummary = adminOrderService.getOrderSummary();
            overview.put("totalOrders", orderSummary.getTotalOrders());
            overview.put("pendingOrders", orderSummary.getPendingOrders());
            overview.put("processingOrders", orderSummary.getProcessingOrders());
            overview.put("shippedOrders", orderSummary.getShippedOrders());
            overview.put("deliveredOrders", orderSummary.getDeliveredOrders());
            overview.put("totalRevenue", orderSummary.getTotalRevenue());
            overview.put("todayRevenue", orderSummary.getTodayRevenue());
            
            // Product stats
            List<ProductDto> lowStockProducts = adminProductService.getLowStockProducts(10);
            overview.put("lowStockProductsCount", lowStockProducts.size());
            overview.put("lowStockProducts", lowStockProducts);
            
            // Service status
            overview.put("productServiceAvailable", adminProductService.isProductServiceAvailable());
            overview.put("orderServiceAvailable", adminOrderService.isOrderServiceAvailable());
            
        } catch (Exception e) {
            overview.put("error", "Some services are unavailable");
            overview.put("productServiceAvailable", false);
            overview.put("orderServiceAvailable", false);
        }
        
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/stats/orders")
    public ResponseEntity<OrderServiceClient.OrderSummaryDto> getOrderStats() {
        OrderServiceClient.OrderSummaryDto summary = adminOrderService.getOrderSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/stats/orders/daily")
    public ResponseEntity<List<OrderServiceClient.OrderStatsDto>> getDailyOrderStats(
            @RequestParam(defaultValue = "7") int days) {
        // Calculate date range for last N days
        java.time.LocalDate endDate = java.time.LocalDate.now();
        java.time.LocalDate startDate = endDate.minusDays(days);
        
        List<OrderServiceClient.OrderStatsDto> stats = adminOrderService.getDailyOrderStats(
            startDate.toString(), endDate.toString());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        
        try {
            // Low stock alerts
            List<ProductDto> lowStockProducts = adminProductService.getLowStockProducts(5);
            alerts.put("lowStockAlerts", lowStockProducts.size());
            alerts.put("lowStockProducts", lowStockProducts);
            
            // Pending orders alert
            OrderServiceClient.OrderSummaryDto orderSummary = adminOrderService.getOrderSummary();
            alerts.put("pendingOrdersCount", orderSummary.getPendingOrders());
            
            // Service status alerts
            boolean productServiceDown = !adminProductService.isProductServiceAvailable();
            boolean orderServiceDown = !adminOrderService.isOrderServiceAvailable();
            
            alerts.put("serviceAlerts", productServiceDown || orderServiceDown);
            alerts.put("productServiceDown", productServiceDown);
            alerts.put("orderServiceDown", orderServiceDown);
            
        } catch (Exception e) {
            alerts.put("error", "Unable to fetch alerts");
        }
        
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        
        health.put("adminService", "UP");
        health.put("productService", adminProductService.isProductServiceAvailable() ? "UP" : "DOWN");
        health.put("orderService", adminOrderService.isOrderServiceAvailable() ? "UP" : "DOWN");
        health.put("timestamp", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(health);
    }
}