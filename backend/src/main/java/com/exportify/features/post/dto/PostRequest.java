package com.exportify.features.post.dto;

public record PostRequest(
        String content,
        String imageUrl,
        Long userId // Necesitamos saber quién publica (su ID)
) {}