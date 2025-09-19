package com.mystore.product.service;

import com.mystore.product.dto.ProductDto;
import com.mystore.product.model.Product;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    Page<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir);
    List<ProductDto> getActiveProducts();
    Optional<ProductDto> getProductById(Long id);
    Page<ProductDto> searchProducts(String query, String category, String brand, int page, int size);
    List<String> getCategories();
    List<String> getBrands();
    List<ProductDto> getLowStockProducts(int threshold);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    ProductDto updateStock(Long id, Integer quantity);
    void deleteProduct(Long id);
    ProductDto convertToDto(Product product);
    Product convertToEntity(ProductDto productDto);
}