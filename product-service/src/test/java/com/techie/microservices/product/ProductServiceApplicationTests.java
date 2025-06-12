package com.techie.microservices.product;

import com.techie.microservices.product.dto.ProductRequest;
import com.techie.microservices.product.dto.ProductResponse;
import com.techie.microservices.product.model.Product;
import com.techie.microservices.product.repository.ProductRepository;
import com.techie.microservices.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
public class ProductServiceApplicationTests {

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Test
    void shouldCreateProduct() {
        // Arrange
        ProductRequest productRequest = new ProductRequest("1", "Product 1", "Test Description", "sku123", BigDecimal.valueOf(100.0));
        Product product = Product.builder()
                .id("1")
                .name("Product 1")
                .description("Test Description")
                .skuCode("sku123")
                .price(BigDecimal.valueOf(100.0))
                .build();

        Mockito.when(productRepository.insert(Mockito.any(Product.class))).thenReturn(product);

        // Act
        ProductResponse response = productService.createProduct(productRequest);

        // Assert
        assertEquals(product.getName(), response.name());
        assertEquals(product.getDescription(), response.description());
        assertEquals(product.getSkuCode(), response.skuCode());
    }
}