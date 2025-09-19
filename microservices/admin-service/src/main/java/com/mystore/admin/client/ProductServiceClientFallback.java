package com.mystore.admin.client;

import com.mystore.admin.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ProductServiceClientFallback implements ProductServiceClient {
    
    @Override
    public ResponseEntity<Page<ProductDto>> getAllProducts(int page, int size, String sortBy, String sortDir) {
        return ResponseEntity.ok(new PageImpl<>(Collections.emptyList()));
    }
    
    @Override
    public ResponseEntity<ProductDto> getProductById(Long id) {
        return ResponseEntity.notFound().build();
    }
    
    @Override
    public ResponseEntity<ProductDto> createProduct(ProductDto product) {
        return ResponseEntity.status(503).build(); // Service Unavailable
    }
    
    @Override
    public ResponseEntity<ProductDto> updateProduct(Long id, ProductDto product) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<Void> deleteProduct(Long id) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<Page<ProductDto>> searchProducts(String query, String category, String brand, int page, int size) {
        return ResponseEntity.ok(new PageImpl<>(Collections.emptyList()));
    }
    
    @Override
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @Override
    public ResponseEntity<List<String>> getBrands() {
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @Override
    public ResponseEntity<ProductDto> updateStock(Long id, Integer quantity) {
        return ResponseEntity.status(503).build();
    }
    
    @Override
    public ResponseEntity<List<ProductDto>> getLowStockProducts(int threshold) {
        return ResponseEntity.ok(Collections.emptyList());
    }
}