package com.mystore.user.controller;

import com.mystore.user.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private final IUserService userService;
    
    public TestController(IUserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "user-service");
        response.put("timestamp", System.currentTimeMillis());
        response.put("totalUsers", userService.getAllUsers().size());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> databaseCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            long userCount = userService.getAllUsers().size();
            response.put("database", "connected");
            response.put("userCount", userCount);
            response.put("status", "OK");
        } catch (Exception e) {
            response.put("database", "error");
            response.put("error", e.getMessage());
            response.put("status", "FAILED");
        }
        return ResponseEntity.ok(response);
    }
}