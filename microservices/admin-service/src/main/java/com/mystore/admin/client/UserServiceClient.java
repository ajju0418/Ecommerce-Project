package com.mystore.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-service", fallback = UserServiceClientFallback.class)
public interface UserServiceClient {
    
    @GetMapping("/api/users")
    ResponseEntity<List<UserDto>> getAllUsers();
    
    @GetMapping("/api/users/{id}")
    ResponseEntity<UserDto> getUserById(@PathVariable Long id);
    
    @PostMapping("/api/users")
    ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request);
    
    @PutMapping("/api/users/{id}")
    ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request);
    
    @DeleteMapping("/api/users/{id}")
    ResponseEntity<Void> deleteUser(@PathVariable Long id);
    
    @GetMapping("/api/users/stats")
    ResponseEntity<UserStatsDto> getUserStats();
    
    // DTOs
    class UserDto {
        private Long id;
        private String username;
        private String email;
        private String phone;
        private String gender;
        private String role;
        private boolean active;
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
    
    class CreateUserRequest {
        private String username;
        private String email;
        private String password;
        private String phone;
        private String gender;
        
        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
    }
    
    class UpdateUserRequest {
        private String username;
        private String email;
        private String phone;
        private String gender;
        private boolean active;
        
        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
    
    class UserStatsDto {
        private long totalUsers;
        private long activeUsers;
        private long newUsersToday;
        
        // Getters and Setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
        public long getNewUsersToday() { return newUsersToday; }
        public void setNewUsersToday(long newUsersToday) { this.newUsersToday = newUsersToday; }
    }
}