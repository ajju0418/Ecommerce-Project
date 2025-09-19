package com.mystore.admin.controller;

import com.mystore.admin.client.UserServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @GetMapping
    public ResponseEntity<List<UserServiceClient.UserDto>> getAllUsers() {
        return userServiceClient.getAllUsers();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserServiceClient.UserDto> getUserById(@PathVariable Long id) {
        return userServiceClient.getUserById(id);
    }
    
    @PostMapping
    public ResponseEntity<UserServiceClient.UserDto> createUser(@RequestBody UserServiceClient.CreateUserRequest request) {
        return userServiceClient.createUser(request);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserServiceClient.UserDto> updateUser(@PathVariable Long id, @RequestBody UserServiceClient.UpdateUserRequest request) {
        return userServiceClient.updateUser(id, request);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userServiceClient.deleteUser(id);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<UserServiceClient.UserStatsDto> getUserStats() {
        return userServiceClient.getUserStats();
    }
}