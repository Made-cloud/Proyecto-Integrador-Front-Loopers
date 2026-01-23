package com.exportify.features.products.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products") // Nombre de la tabla en plural y minúsculas
@Data // @Data de Lombok ya incluye @Getter, @Setter, @ToString, etc.
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // En Java se llama "id", en la BD será la Primary Key de esta tabla

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description; // Importante para explicar qué trae el curso

    @NotNull(message = "El precio del producto es obligatorio")
    @Column(precision = 10, scale = 2) // Esto define 10 dígitos en total, 2 decimales
    private BigDecimal price;

    @Column(columnDefinition = "TEXT") // Cambio clave: Permite guardar el Base64 completo
    private String imageUrl; // ¡Nuevo! Para la foto de portada del curso

    // En cursos digitales el stock a veces es infinito, pero lo dejamos por si acaso
    // (ej: cupos limitados para una clase en vivo)
    private Integer stock;

    private boolean active; // Para ocultar el curso si ya no lo vendes
}
