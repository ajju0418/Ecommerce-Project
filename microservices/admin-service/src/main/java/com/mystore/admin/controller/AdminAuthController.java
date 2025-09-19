package com.mystore.admin.controller;

import com.mystore.admin.dto.AdminDto;
import com.mystore.admin.service.AdminService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminService adminService;

    public AdminAuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            boolean isValid = adminService.validateCredentials(request.getUsername(), request.getPassword());
            
            if (isValid) {
                Optional<AdminDto> adminOpt = adminService.getAdminByUsername(request.getUsername());
                if (adminOpt.isPresent()) {
                    AdminDto admin = adminOpt.get();
                    adminService.updateLastLogin(request.getUsername());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("id", admin.getId());
                    response.put("username", admin.getUsername());
                    response.put("email", admin.getEmail());
                    response.put("fullName", admin.getFullName());
                    response.put("role", admin.getRole().name());
                    response.put("token", "admin-jwt-token-" + admin.getId());
                    
                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Service error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Invalid credentials");
        return ResponseEntity.status(401).body(errorResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<AdminDto> getProfile(@PathVariable String username) {
        Optional<AdminDto> admin = adminService.getAdminByUsername(username);
        return admin.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/change-password/{adminId}")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Long adminId,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        boolean success = adminService.changePassword(adminId, request.getCurrentPassword(), request.getNewPassword());
        
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("success", true);
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Current password is incorrect");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Request DTOs
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;
        
        @NotBlank(message = "Password is required")
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ChangePasswordRequest {
        @NotBlank(message = "Current password is required")
        private String currentPassword;
        
        @NotBlank(message = "New password is required")
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}