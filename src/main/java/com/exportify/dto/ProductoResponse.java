package com.exportify.dto;

import java.math.BigDecimal;

public record ProductoResponse (
    Long id,
    String nombre,
    BigDecimal precio,
    int stock
){}
