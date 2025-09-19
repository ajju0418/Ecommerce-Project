package com.mystore.product.config;

import com.mystore.product.model.Product;
import com.mystore.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            createSampleProducts();
        }
    }

    private void createSampleProducts() {
        // Sample T-Shirts
        Product tshirt1 = new Product();
        tshirt1.setName("Classic Cotton T-Shirt");
        tshirt1.setBrand("MyStore");
        tshirt1.setDescription("Comfortable cotton t-shirt for everyday wear");
        tshirt1.setPrice(new BigDecimal("19.99"));
        tshirt1.setCategory("T-Shirts");
        tshirt1.setSize("M");
        tshirt1.setColor("Blue");
        tshirt1.setStock(50);
        tshirt1.setImageUrl("/assets/product-shirts/tshirt1.jpg");
        productRepository.save(tshirt1);

        Product tshirt2 = new Product();
        tshirt2.setName("Premium Polo Shirt");
        tshirt2.setBrand("MyStore");
        tshirt2.setDescription("Premium quality polo shirt");
        tshirt2.setPrice(new BigDecimal("29.99"));
        tshirt2.setCategory("T-Shirts");
        tshirt2.setSize("L");
        tshirt2.setColor("White");
        tshirt2.setStock(30);
        tshirt2.setImageUrl("/assets/product-shirts/tshirt2.jpg");
        productRepository.save(tshirt2);

        // Sample Jeans
        Product jeans1 = new Product();
        jeans1.setName("Slim Fit Jeans");
        jeans1.setBrand("Denim Co");
        jeans1.setDescription("Modern slim fit jeans");
        jeans1.setPrice(new BigDecimal("49.99"));
        jeans1.setCategory("Jeans");
        jeans1.setSize("32");
        jeans1.setColor("Dark Blue");
        jeans1.setStock(25);
        jeans1.setImageUrl("/assets/product-shirts/jeans1.jpg");
        productRepository.save(jeans1);

        // Sample Shoes
        Product shoes1 = new Product();
        shoes1.setName("Running Sneakers");
        shoes1.setBrand("SportMax");
        shoes1.setDescription("Comfortable running sneakers");
        shoes1.setPrice(new BigDecimal("79.99"));
        shoes1.setCategory("Shoes");
        shoes1.setSize("10");
        shoes1.setColor("Black");
        shoes1.setStock(15);
        shoes1.setImageUrl("/assets/product-shirts/shoes1.jpg");
        productRepository.save(shoes1);

        System.out.println("Sample products created successfully!");
    }
}