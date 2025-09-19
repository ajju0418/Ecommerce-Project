package com.mystore.admin.controller;

import com.mystore.admin.dto.AdminDto;
import com.mystore.admin.model.Admin;
import com.mystore.admin.service.AdminService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/management")
public class AdminManagementController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/admins")
    public ResponseEntity<Page<AdminDto>> getAllAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<AdminDto> admins = adminService.getAllAdmins(page, size, sortBy, sortDir);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<AdminDto> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admins")
    public ResponseEntity<AdminDto> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        try {
            AdminDto admin = adminService.createAdmin(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getRole()
            );
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<AdminDto> updateAdmin(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdminRequest request) {
        try {
            AdminDto admin = adminService.updateAdmin(
                id,
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getRole(),
                request.getStatus()
            );
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        try {
            adminService.deleteAdmin(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admins/search")
    public ResponseEntity<List<AdminDto>> searchAdmins(@RequestParam String query) {
        List<AdminDto> admins = adminService.searchAdmins(query);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/admins/status/{status}")
    public ResponseEntity<List<AdminDto>> getAdminsByStatus(@PathVariable Admin.Status status) {
        List<AdminDto> admins = adminService.getAdminsByStatus(status);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/admins/role/{role}")
    public ResponseEntity<List<AdminDto>> getAdminsByRole(@PathVariable Admin.Role role) {
        List<AdminDto> admins = adminService.getAdminsByRole(role);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long activeAdmins = adminService.getActiveAdminCount();
        List<AdminDto> superAdmins = adminService.getAdminsByRole(Admin.Role.SUPERADMIN);
        List<AdminDto> regularAdmins = adminService.getAdminsByRole(Admin.Role.ADMIN);
        
        return ResponseEntity.ok(Map.of(
            "activeAdmins", activeAdmins,
            "superAdmins", superAdmins.size(),
            "regularAdmins", regularAdmins.size(),
            "totalAdmins", superAdmins.size() + regularAdmins.size()
        ));
    }

    // Request DTOs
    public static class CreateAdminRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50)
        private String username;
        
        @NotBlank(message = "Email is required")
        @Email
        private String email;
        
        @NotBlank(message = "Password is required")
        @Size(min = 6)
        private String password;
        
        @NotBlank(message = "First name is required")
        private String firstName;
        
        @NotBlank(message = "Last name is required")
        private String lastName;
        
        private Admin.Role role = Admin.Role.ADMIN;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public Admin.Role getRole() { return role; }
        public void setRole(Admin.Role role) { this.role = role; }
    }

    public static class UpdateAdminRequest {
        @Email
        private String email;
        private String firstName;
        private String lastName;
        private Admin.Role role;
        private Admin.Status status;

        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public Admin.Role getRole() { return role; }
        public void setRole(Admin.Role role) { this.role = role; }
        public Admin.Status getStatus() { return status; }
        public void setStatus(Admin.Status status) { this.status = status; }
    }
}