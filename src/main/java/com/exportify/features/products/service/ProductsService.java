package com.exportify.features.products.service;

import com.exportify.dto.ProductoRequest;
import com.exportify.dto.ProductoResponse;

import java.util.List;

public interface ProductsService {
    ProductoResponse crearProducto(ProductoRequest request);
    ProductoResponse obtenerProducto(Long id);
    List<ProductoResponse> listarProductos();
    void eliminarProducto(Long id);
    ProductoResponse actualizarProducto(Long id, ProductoRequest request);

}
