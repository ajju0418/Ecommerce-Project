package com.mystore.admin.repository;

import com.mystore.admin.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByUsername(String username);
    
    Optional<Admin> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<Admin> findByStatus(Admin.Status status);
    
    List<Admin> findByRole(Admin.Role role);
    
    @Query("SELECT a FROM Admin a WHERE a.status = :status AND a.role = :role")
    List<Admin> findByStatusAndRole(@Param("status") Admin.Status status, @Param("role") Admin.Role role);
    
    @Query("SELECT a FROM Admin a WHERE a.lastLogin >= :since")
    List<Admin> findActiveAdminsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(a) FROM Admin a WHERE a.status = 'ACTIVE'")
    long countActiveAdmins();
    
    @Query("SELECT a FROM Admin a WHERE LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Admin> searchAdmins(@Param("search") String search);
}