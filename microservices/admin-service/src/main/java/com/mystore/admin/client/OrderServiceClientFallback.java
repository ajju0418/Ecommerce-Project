package com.mystore.admin.client;

import com.mystore.admin.dto.OrderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class OrderServiceClientFallback implements OrderServiceClient {
    
    @Override
    public ResponseEntity<Page<OrderDto>> getAllOrders(int page, int size, String sortBy, String sortDir) {
        return ResponseEntity.ok(new PageImpl<>(Collections.emptyList()));
    }
    
    @Override
    public ResponseEntity<OrderDto> getOrderById(Long id) {
        return ResponseEntity.notFound().build();
    }
    
    @Override
    public ResponseEntity<OrderDto> updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(String status) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @Override
    public ResponseEntity<List<OrderDto>> getOrdersByUserId(Long userId) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @Override
    public ResponseEntity<Page<OrderDto>> searchOrders(String query, String status, String startDate, String endDate, int page, int size) {
        return ResponseEntity.ok(new PageImpl<>(Collections.emptyList()));
    }
    
    @Override
    public ResponseEntity<List<OrderStatsDto>> getDailyOrderStats(String startDate, String endDate) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @Override
    public ResponseEntity<OrderSummaryDto> getOrderSummary() {
        OrderSummaryDto summary = new OrderSummaryDto();
        summary.setTotalOrders(0L);
        summary.setPendingOrders(0L);
        summary.setProcessingOrders(0L);
        summary.setShippedOrders(0L);
        summary.setDeliveredOrders(0L);
        summary.setTotalRevenue(0.0);
        summary.setTodayRevenue(0.0);
        return ResponseEntity.ok(summary);
    }
}