package com.mystore.user.controller;

import com.mystore.user.dto.*;
import com.mystore.user.model.User;
import com.mystore.user.service.IUserService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    private final IUserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(IUserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody CreateUserRequest request) {
        if (userService.existsByUsername(request.getUsername()) || 
            userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setRole(User.Role.USER);

        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(new UserDto(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return userService.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    LoginResponse response = new LoginResponse();
                    response.setId(user.getId());
                    response.setUsername(user.getUsername());
                    response.setEmail(user.getEmail());
                    response.setRole(user.getRole().name());
                    response.setToken("jwt-token-" + user.getId()); // Simple token for demo
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        // Hardcoded admin credentials for now
        if ("admin".equals(request.getUsername()) && "admin123".equals(request.getPassword())) {
            LoginResponse response = new LoginResponse();
            response.setId(0L); // Admin ID can be 0 or any fixed value
            response.setUsername("admin");
            response.setEmail("admin@mystore.com");
            response.setRole("ADMIN");
            response.setToken(null); // No token for now
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).build();
        }
    }


}