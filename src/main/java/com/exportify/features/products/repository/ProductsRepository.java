package com.exportify.features.products.repository;

import com.exportify.features.products.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Producto, Long> {
}
