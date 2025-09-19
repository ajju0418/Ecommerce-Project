package com.mystore.admin.controller;

import com.mystore.admin.client.ProductServiceClient;
import com.mystore.admin.dto.ProductDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductServiceClient productServiceClient;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        return productServiceClient.getAllProducts(page, size, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return productServiceClient.getProductById(id);
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto product) {
        return productServiceClient.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto product) {
        return productServiceClient.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productServiceClient.deleteProduct(id);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        return productServiceClient.searchProducts(query, category, brand, page, size);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return productServiceClient.getCategories();
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        return productServiceClient.getBrands();
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductDto> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer quantity = request.get("quantity");
        return productServiceClient.updateStock(id, quantity);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        return productServiceClient.getLowStockProducts(threshold);
    }

    @GetMapping("/service-status")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
            "productServiceAvailable", true,
            "message", "Using direct ProductServiceClient"
        ));
    }
}