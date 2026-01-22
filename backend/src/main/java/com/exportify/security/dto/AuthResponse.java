package com.exportify.security.dto;

import com.exportify.features.users.model.RolUser;

public record AuthResponse(
        String name,
        String email,
        RolUser rol,
        String token
) {}