package com.mystore.admin.service;

import com.mystore.admin.dto.AdminDto;
import com.mystore.admin.model.Admin;
import com.mystore.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService implements IAdminService {
    
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<AdminDto> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(AdminDto::new)
                .collect(Collectors.toList());
    }
    
    public Page<AdminDto> getAllAdmins(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return adminRepository.findAll(pageable)
                .map(AdminDto::new);
    }
    
    public Optional<AdminDto> getAdminById(Long id) {
        return adminRepository.findById(id)
                .map(AdminDto::new);
    }
    
    public Optional<AdminDto> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username)
                .map(AdminDto::new);
    }
    
    public AdminDto createAdmin(String username, String email, String password, 
                               String firstName, String lastName, Admin.Role role) {
        if (adminRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (adminRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setRole(role != null ? role : Admin.Role.ADMIN);
        admin.setStatus(Admin.Status.ACTIVE);
        
        Admin savedAdmin = adminRepository.save(admin);
        return new AdminDto(savedAdmin);
    }
    
    public AdminDto updateAdmin(Long id, String email, String firstName, String lastName, 
                               Admin.Role role, Admin.Status status) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (email != null && !email.equals(admin.getEmail())) {
            if (adminRepository.existsByEmail(email)) {
                throw new RuntimeException("Email already exists");
            }
            admin.setEmail(email);
        }
        
        if (firstName != null) admin.setFirstName(firstName);
        if (lastName != null) admin.setLastName(lastName);
        if (role != null) admin.setRole(role);
        if (status != null) admin.setStatus(status);
        
        Admin updatedAdmin = adminRepository.save(admin);
        return new AdminDto(updatedAdmin);
    }
    
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }
        adminRepository.deleteById(id);
    }
    
    public boolean validateCredentials(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getStatus() == Admin.Status.ACTIVE) {
                return passwordEncoder.matches(password, admin.getPassword());
            }
        }
        return false;
    }
    
    public void updateLastLogin(String username) {
        adminRepository.findByUsername(username).ifPresent(admin -> {
            admin.setLastLogin(LocalDateTime.now());
            adminRepository.save(admin);
        });
    }
    
    public List<AdminDto> searchAdmins(String searchTerm) {
        return adminRepository.searchAdmins(searchTerm).stream()
                .map(AdminDto::new)
                .collect(Collectors.toList());
    }
    
    public List<AdminDto> getAdminsByStatus(Admin.Status status) {
        return adminRepository.findByStatus(status).stream()
                .map(AdminDto::new)
                .collect(Collectors.toList());
    }
    
    public List<AdminDto> getAdminsByRole(Admin.Role role) {
        return adminRepository.findByRole(role).stream()
                .map(AdminDto::new)
                .collect(Collectors.toList());
    }
    
    public long getActiveAdminCount() {
        return adminRepository.countActiveAdmins();
    }
    
    public boolean changePassword(Long adminId, String currentPassword, String newPassword) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
            return false;
        }
        
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
        return true;
    }
    
    @Override
    public AdminDto createAdmin(AdminDto adminDto) {
        Admin admin = convertToEntity(adminDto);
        admin.setPassword(passwordEncoder.encode("defaultPassword"));
        Admin savedAdmin = adminRepository.save(admin);
        return convertToDto(savedAdmin);
    }
    
    @Override
    public AdminDto updateAdmin(Long id, AdminDto adminDto) {
        Admin existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        existingAdmin.setEmail(adminDto.getEmail());
        existingAdmin.setFirstName(adminDto.getFirstName());
        existingAdmin.setLastName(adminDto.getLastName());
        existingAdmin.setRole(adminDto.getRole());
        existingAdmin.setStatus(adminDto.getStatus());
        
        Admin updatedAdmin = adminRepository.save(existingAdmin);
        return convertToDto(updatedAdmin);
    }
    
    @Override
    public AdminDto convertToDto(Admin admin) {
        return new AdminDto(admin);
    }
    
    @Override
    public Admin convertToEntity(AdminDto adminDto) {
        Admin admin = new Admin();
        admin.setId(adminDto.getId());
        admin.setUsername(adminDto.getUsername());
        admin.setEmail(adminDto.getEmail());
        admin.setFirstName(adminDto.getFirstName());
        admin.setLastName(adminDto.getLastName());
        admin.setRole(adminDto.getRole());
        admin.setStatus(adminDto.getStatus());
        return admin;
    }
}