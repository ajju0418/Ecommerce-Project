package com.mystore.user.config;

import com.mystore.user.model.User;
import com.mystore.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create superadmin user
        if (!userRepository.existsByUsername("ajay")) {
            User superadmin = new User();
            superadmin.setUsername("ajay");
            superadmin.setEmail("ajay@mystore.com");
            superadmin.setPassword(passwordEncoder.encode("ajay123"));
            superadmin.setPhone("9999999999");
            superadmin.setGender("Male");
            superadmin.setRole(User.Role.SUPERADMIN);
            userRepository.save(superadmin);
        }

        // Create default admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@mystore.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("1234567890");
            admin.setGender("Male");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }
    }
}