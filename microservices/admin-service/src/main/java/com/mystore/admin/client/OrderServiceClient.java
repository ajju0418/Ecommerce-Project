package com.mystore.admin.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "order-service", fallback = OrderServiceClientFallback.class)
public interface OrderServiceClient {
    
    @GetMapping("/api/orders")
    ResponseEntity<Page<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    );
    
    @GetMapping("/api/orders/{id}")
    ResponseEntity<OrderDto> getOrderById(@PathVariable Long id);
    
    @PutMapping("/api/orders/{id}/status")
    ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody UpdateOrderStatusRequest request
    );
    
    @GetMapping("/api/orders/status/{status}")
    ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable String status);
    
    @GetMapping("/api/orders/user/{userId}")
    ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable Long userId);
    
    @GetMapping("/api/orders/search")
    ResponseEntity<Page<OrderDto>> searchOrders(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    );
    
    @GetMapping("/api/orders/stats/daily")
    ResponseEntity<List<OrderStatsDto>> getDailyOrderStats(
            @RequestParam String startDate,
            @RequestParam String endDate
    );
    
    @GetMapping("/api/orders/stats/summary")
    ResponseEntity<OrderSummaryDto> getOrderSummary();
    
    class UpdateOrderStatusRequest {
        private String status;
        private String notes;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
    
    class OrderStatsDto {
        private String date;
        private Long totalOrders;
        private Double totalRevenue;
        
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public Long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    }
    
    class OrderDto {
        private Long id;
        private Long userId;
        private String status;
        private Double totalAmount;
        private String shippingAddress;
        private LocalDateTime createdAt;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
    
    class OrderSummaryDto {
        private Long totalOrders;
        private Long pendingOrders;
        private Long processingOrders;
        private Long shippedOrders;
        private Long deliveredOrders;
        private Double totalRevenue;
        private Double todayRevenue;
        
        // Getters and Setters
        public Long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
        public Long getPendingOrders() { return pendingOrders; }
        public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }
        public Long getProcessingOrders() { return processingOrders; }
        public void setProcessingOrders(Long processingOrders) { this.processingOrders = processingOrders; }
        public Long getShippedOrders() { return shippedOrders; }
        public void setShippedOrders(Long shippedOrders) { this.shippedOrders = shippedOrders; }
        public Long getDeliveredOrders() { return deliveredOrders; }
        public void setDeliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
        public Double getTodayRevenue() { return todayRevenue; }
        public void setTodayRevenue(Double todayRevenue) { this.todayRevenue = todayRevenue; }
    }
}