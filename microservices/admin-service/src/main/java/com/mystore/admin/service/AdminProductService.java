package com.mystore.admin.service;

import com.mystore.admin.client.ProductServiceClient;
import com.mystore.admin.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminProductService {
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    public Page<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir) {
        ResponseEntity<Page<ProductDto>> response = productServiceClient.getAllProducts(page, size, sortBy, sortDir);
        return response.getBody();
    }
    
    public Optional<ProductDto> getProductById(Long id) {
        try {
            ResponseEntity<ProductDto> response = productServiceClient.getProductById(id);
            return response.getStatusCode().is2xxSuccessful() ? 
                   Optional.ofNullable(response.getBody()) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    public ProductDto createProduct(ProductDto product) {
        ResponseEntity<ProductDto> response = productServiceClient.createProduct(product);
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to create product: " + response.getStatusCode());
    }
    
    public ProductDto updateProduct(Long id, ProductDto product) {
        ResponseEntity<ProductDto> response = productServiceClient.updateProduct(id, product);
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to update product: " + response.getStatusCode());
    }
    
    public void deleteProduct(Long id) {
        ResponseEntity<Void> response = productServiceClient.deleteProduct(id);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to delete product: " + response.getStatusCode());
        }
    }
    
    public Page<ProductDto> searchProducts(String query, String category, String brand, int page, int size) {
        ResponseEntity<Page<ProductDto>> response = productServiceClient.searchProducts(query, category, brand, page, size);
        return response.getBody();
    }
    
    public List<String> getCategories() {
        ResponseEntity<List<String>> response = productServiceClient.getCategories();
        return response.getBody();
    }
    
    public List<String> getBrands() {
        ResponseEntity<List<String>> response = productServiceClient.getBrands();
        return response.getBody();
    }
    
    public ProductDto updateStock(Long productId, Integer quantity) {
        ResponseEntity<ProductDto> response = productServiceClient.updateStock(productId, quantity);
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to update stock: " + response.getStatusCode());
    }
    
    public List<ProductDto> getLowStockProducts(int threshold) {
        ResponseEntity<List<ProductDto>> response = productServiceClient.getLowStockProducts(threshold);
        return response.getBody();
    }
    
    public boolean isProductServiceAvailable() {
        try {
            productServiceClient.getAllProducts(0, 1, "id", "asc");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}