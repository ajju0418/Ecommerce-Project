package com.mystore.admin.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserServiceClientFallback implements UserServiceClient {
    
    @Override
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(new ArrayList<>());
    }
    
    @Override
    public ResponseEntity<UserDto> getUserById(Long id) {
        return ResponseEntity.notFound().build();
    }
    
    @Override
    public ResponseEntity<UserDto> createUser(CreateUserRequest request) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<UserDto> updateUser(Long id, UpdateUserRequest request) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<Void> deleteUser(Long id) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<UserStatsDto> getUserStats() {
        UserStatsDto stats = new UserStatsDto();
        stats.setTotalUsers(0);
        stats.setActiveUsers(0);
        stats.setNewUsersToday(0);
        return ResponseEntity.ok(stats);
    }
}