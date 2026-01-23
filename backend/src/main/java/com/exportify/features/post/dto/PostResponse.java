package com.exportify.features.post.dto;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String content,
        String imageUrl,
        Long authorId,
        String authorName,
        String avatarUrl,
        int likes,
        LocalDateTime createdAt
) {}