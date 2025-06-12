package com.techie.microservices.product.service;

import com.techie.microservices.product.dto.ProductRequest;
import com.techie.microservices.product.dto.ProductResponse;
//import com.techie.microservices.product.exception.BadRequestCustomException;
import com.techie.microservices.product.model.Product;
import com.techie.microservices.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        log.info("Creating product {}", productRequest);

        try {
            if (productRequestValidation(productRequest)) {
                Product product = Product.builder()
                        .name(productRequest.name())
                        .description(productRequest.description())
                        .skuCode(productRequest.skuCode())
                        .price(productRequest.price())
                        .build();
                productRepository.insert(product);
                log.info("Product created successfully");
                return new ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getSkuCode(), product.getPrice());
            }

            return null;
        } catch (Exception e) {
            log.error("Product creation failed", e);
            throw new RuntimeException("Product creation failed", e);
        }
    }

    private boolean productRequestValidation(ProductRequest productRequest) {
        if (productRepository.existsBySkuCode(productRequest.skuCode())) {
            throw new RuntimeException("Error with Product with SKU Code " + productRequest.skuCode());
        }
        if (productRequest.price() == null || productRequest.price().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Product price must be greater than zero");
        }
        if (productRequest.name() == null || productRequest.name().isBlank()) {
            throw new RuntimeException("Product name cannot be blank");
        }
        if (productRequest.description() == null || productRequest.description().isBlank()) {
            throw new RuntimeException("Product description cannot be blank");
        }
        return true;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(product -> new ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getSkuCode(), product.getPrice()))
                .toList();
    }
}
