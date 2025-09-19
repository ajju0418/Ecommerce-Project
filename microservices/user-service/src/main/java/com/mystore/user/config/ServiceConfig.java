package com.mystore.user.config;

import com.mystore.user.repository.UserRepository;
import com.mystore.user.service.IUserService;
import com.mystore.user.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServiceConfig {
    
    @Bean
    public IUserService userService(UserRepository userRepository) {
        return new UserService(userRepository);
    }
}