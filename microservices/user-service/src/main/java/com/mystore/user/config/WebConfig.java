package com.mystore.user.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {
    // CORS configuration removed to avoid duplicate headers with API Gateway
    // All CORS handling is now managed exclusively by the API Gateway
}
