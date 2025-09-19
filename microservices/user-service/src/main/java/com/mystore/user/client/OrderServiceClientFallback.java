package com.mystore.user.client;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderServiceClientFallback implements OrderServiceClient {
    
    @Override
    public List<OrderDto> getOrdersByUserId(Long userId) {
        return new ArrayList<>();
    }
}