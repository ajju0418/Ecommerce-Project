package com.mystore.admin.service;

import com.mystore.admin.client.OrderServiceClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminOrderService {
    
    @Autowired
    private OrderServiceClient orderServiceClient;
    
    public Page<OrderServiceClient.OrderDto> getAllOrders(int page, int size, String sortBy, String sortDir) {
        ResponseEntity<Page<OrderServiceClient.OrderDto>> response = orderServiceClient.getAllOrders(page, size, sortBy, sortDir);
        return response.getBody();
    }
    
    public Optional<OrderServiceClient.OrderDto> getOrderById(Long id) {
        try {
            ResponseEntity<OrderServiceClient.OrderDto> response = orderServiceClient.getOrderById(id);
            return response.getStatusCode().is2xxSuccessful() ? 
                   Optional.ofNullable(response.getBody()) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    public OrderServiceClient.OrderDto updateOrderStatus(Long orderId, String status, String notes) {
        OrderServiceClient.UpdateOrderStatusRequest request = new OrderServiceClient.UpdateOrderStatusRequest();
        request.setStatus(status);
        request.setNotes(notes);
        
        ResponseEntity<OrderServiceClient.OrderDto> response = orderServiceClient.updateOrderStatus(orderId, request);
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to update order status: " + response.getStatusCode());
    }
    
    public List<OrderServiceClient.OrderDto> getOrdersByStatus(String status) {
        ResponseEntity<List<OrderServiceClient.OrderDto>> response = orderServiceClient.getOrdersByStatus(status);
        return response.getBody();
    }
    
    public List<OrderServiceClient.OrderDto> getOrdersByUserId(Long userId) {
        ResponseEntity<List<OrderServiceClient.OrderDto>> response = orderServiceClient.getOrdersByUserId(userId);
        return response.getBody();
    }
    
    public Page<OrderServiceClient.OrderDto> searchOrders(String query, String status, String startDate, String endDate, int page, int size) {
        ResponseEntity<Page<OrderServiceClient.OrderDto>> response = orderServiceClient.searchOrders(query, status, startDate, endDate, page, size);
        return response.getBody();
    }
    
    public List<OrderServiceClient.OrderStatsDto> getDailyOrderStats(String startDate, String endDate) {
        ResponseEntity<List<OrderServiceClient.OrderStatsDto>> response = orderServiceClient.getDailyOrderStats(startDate, endDate);
        return response.getBody();
    }
    
    public OrderServiceClient.OrderSummaryDto getOrderSummary() {
        ResponseEntity<OrderServiceClient.OrderSummaryDto> response = orderServiceClient.getOrderSummary();
        return response.getBody();
    }
    
    public boolean isOrderServiceAvailable() {
        try {
            orderServiceClient.getAllOrders(0, 1, "id", "desc");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Helper methods for common order operations
    public OrderServiceClient.OrderDto confirmOrder(Long orderId) {
        return updateOrderStatus(orderId, "CONFIRMED", "Order confirmed by admin");
    }
    
    public OrderServiceClient.OrderDto processOrder(Long orderId) {
        return updateOrderStatus(orderId, "PROCESSING", "Order is being processed");
    }
    
    public OrderServiceClient.OrderDto shipOrder(Long orderId, String trackingInfo) {
        return updateOrderStatus(orderId, "SHIPPED", "Order shipped. Tracking: " + trackingInfo);
    }
    
    public OrderServiceClient.OrderDto deliverOrder(Long orderId) {
        return updateOrderStatus(orderId, "DELIVERED", "Order delivered successfully");
    }
    
    public OrderServiceClient.OrderDto cancelOrder(Long orderId, String reason) {
        return updateOrderStatus(orderId, "CANCELLED", "Order cancelled. Reason: " + reason);
    }
}