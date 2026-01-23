package com.exportify.features.products.service;

import com.exportify.features.products.dto.ProductRequest;
import com.exportify.features.products.dto.ProductResponse;
import java.util.List;

public interface ProductsService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}