package com.exportify.features.users.dto;

import com.exportify.features.users.model.RolUser;

public record UserResponse(
        Long id,
        String name,
        String email,
        RolUser rol,
        String address,
        String phoneNumber,
        boolean active
) {}