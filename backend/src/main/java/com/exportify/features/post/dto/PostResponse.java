package com.exportify.features.post.dto;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String content,
        String imageUrl,
        String authorName, // Solo enviamos el nombre, no todo el usuario
        String avatarUrl,  // (Opcional) Si tu usuario tuviera avatar
        int likes,
        LocalDateTime createdAt
) {}