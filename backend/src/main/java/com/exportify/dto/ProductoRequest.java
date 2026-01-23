package com.exportify.dto;

import java.math.BigDecimal;

public record ProductoRequest (
    String nombre,
    BigDecimal precio,
    int stock
){}
