package com.mystore.admin.controller;

import com.mystore.admin.client.OrderServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    
    @Autowired
    private OrderServiceClient orderServiceClient;
    
    @GetMapping
    public ResponseEntity<Page<OrderServiceClient.OrderDto>> getAllOrders() {
        return orderServiceClient.getAllOrders(0, 20, null, null);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderServiceClient.OrderDto> getOrderById(@PathVariable Long id) {
        return orderServiceClient.getOrderById(id);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderServiceClient.OrderDto> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody OrderServiceClient.UpdateOrderStatusRequest request) {
        return orderServiceClient.updateOrderStatus(id, request);
    }
    
    @GetMapping("/stats/summary")
    public ResponseEntity<OrderServiceClient.OrderSummaryDto> getOrderSummary() {
        return orderServiceClient.getOrderSummary();
    }
    
    @GetMapping("/stats/daily")
    public ResponseEntity<List<OrderServiceClient.OrderStatsDto>> getDailyOrderStats(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return orderServiceClient.getDailyOrderStats(startDate, endDate);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderServiceClient.OrderDto>> getOrdersByUserId(@PathVariable Long userId) {
        return orderServiceClient.getOrdersByUserId(userId);
    }
}