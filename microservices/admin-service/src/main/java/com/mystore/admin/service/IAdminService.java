package com.mystore.admin.service;

import com.mystore.admin.dto.AdminDto;
import com.mystore.admin.model.Admin;

import java.util.List;
import java.util.Optional;

public interface IAdminService {
    List<AdminDto> getAllAdmins();
    Optional<AdminDto> getAdminById(Long id);
    Optional<AdminDto> getAdminByUsername(String username);
    boolean validateCredentials(String username, String password);
    AdminDto createAdmin(AdminDto adminDto);
    AdminDto updateAdmin(Long id, AdminDto adminDto);
    void deleteAdmin(Long id);
    boolean changePassword(Long adminId, String currentPassword, String newPassword);
    void updateLastLogin(String username);
    long getActiveAdminCount();
    AdminDto convertToDto(Admin admin);
    Admin convertToEntity(AdminDto adminDto);
}