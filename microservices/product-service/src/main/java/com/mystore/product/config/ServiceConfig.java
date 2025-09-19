package com.mystore.product.config;

import com.mystore.product.repository.ProductRepository;
import com.mystore.product.service.IProductService;
import com.mystore.product.service.ProductService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServiceConfig {
    
    @Bean
    public IProductService productService(ProductRepository productRepository) {
        return new ProductService(productRepository);
    }
}