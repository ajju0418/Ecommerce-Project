package com.mystore.admin.client;

import com.mystore.admin.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "product-service", fallback = ProductServiceClientFallback.class)
public interface ProductServiceClient {
    
    @GetMapping("/api/products")
    ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    );
    
    @GetMapping("/api/products/{id}")
    ResponseEntity<ProductDto> getProductById(@PathVariable Long id);
    
    @PostMapping("/api/products")
    ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto product);
    
    @PutMapping("/api/products/{id}")
    ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto product);
    
    @DeleteMapping("/api/products/{id}")
    ResponseEntity<Void> deleteProduct(@PathVariable Long id);
    
    @GetMapping("/api/products/search")
    ResponseEntity<Page<ProductDto>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    );
    
    @GetMapping("/api/products/categories")
    ResponseEntity<List<String>> getCategories();
    
    @GetMapping("/api/products/brands")
    ResponseEntity<List<String>> getBrands();
    
    @PutMapping("/api/products/{id}/stock")
    ResponseEntity<ProductDto> updateStock(@PathVariable Long id, @RequestParam Integer quantity);
    
    @GetMapping("/api/products/low-stock")
    ResponseEntity<List<ProductDto>> getLowStockProducts(@RequestParam(defaultValue = "10") int threshold);
}