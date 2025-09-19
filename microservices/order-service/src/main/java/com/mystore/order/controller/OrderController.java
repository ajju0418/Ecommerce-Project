package com.mystore.order.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Object>> getOrderSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalOrders", 0L);
        summary.put("pendingOrders", 0L);
        summary.put("processingOrders", 0L);
        summary.put("shippedOrders", 0L);
        summary.put("deliveredOrders", 0L);
        summary.put("totalRevenue", 0.0);
        summary.put("todayRevenue", 0.0);
        return ResponseEntity.ok(summary);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        Map<String, Object> response = new HashMap<>();
        response.put("content", new Object[0]);
        response.put("totalElements", 0);
        return ResponseEntity.ok(response);
    }
}