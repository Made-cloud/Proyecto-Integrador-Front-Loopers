package com.exportify.features.products.service;

import com.exportify.features.products.dto.ProductRequest;
import com.exportify.features.products.dto.ProductResponse;
import com.exportify.features.products.model.Product;
import com.exportify.features.products.repository.ProductRepository;
import com.exportify.exception.NotFoundException; // Asegúrate de tener esta excepción o usa RuntimeException
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Esto inyecta el repositorio automáticamente
public class ProductsServiceImpl implements ProductsService {

    private final ProductRepository repository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .active(request.active() != null ? request.active() : true) // Por defecto true
                .build();

        return toResponse(repository.save(product));
    }

    @Override
    public ProductResponse getProductById(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        if (request.name() != null) product.setName(request.name());
        if (request.description() != null) product.setDescription(request.description());
        if (request.price() != null) product.setPrice(request.price());
        if (request.stock() != null) product.setStock(request.stock());
        if (request.imageUrl() != null) product.setImageUrl(request.imageUrl());
        if (request.active() != null) product.setActive(request.active());

        return toResponse(repository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, producto no existe");
        }
        repository.deleteById(id);
    }

    // Método privado para convertir Entidad -> DTO (Igual que un Mapper)
    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.isActive()
        );
    }
}