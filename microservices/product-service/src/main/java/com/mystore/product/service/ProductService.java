package com.mystore.product.service;

import com.mystore.product.dto.ProductDto;
import com.mystore.product.model.Product;
import com.mystore.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ProductService implements IProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    @Override
    public Page<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable).map(this::convertToDto);
    }
    
    @Override
    public List<ProductDto> getActiveProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToDto);
    }
    
    @Override
    public Page<ProductDto> searchProducts(String query, String category, String brand, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                query != null ? query : "", query != null ? query : "", pageable)
                .map(this::convertToDto);
    }
    
    @Override
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }
    
    @Override
    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }
    
    @Override
    public List<ProductDto> getLowStockProducts(int threshold) {
        return productRepository.findByStockLessThan(threshold).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }
    
    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPrice(productDto.getPrice());
        existingProduct.setCategory(productDto.getCategory());
        existingProduct.setBrand(productDto.getBrand());
        existingProduct.setImageUrl(productDto.getImageUrl());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }
    
    @Override
    public ProductDto updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setStockQuantity(quantity);
        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }
    
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    @Override
    public ProductDto convertToDto(Product product) {
        return new ProductDto(product);
    }
    
    @Override
    public Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setCategory(productDto.getCategory());
        product.setBrand(productDto.getBrand());
        product.setImageUrl(productDto.getImageUrl());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setActive(productDto.isActive());
        return product;
    }
}