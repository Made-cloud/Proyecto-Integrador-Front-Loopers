package com.exportify.security.dto;

import com.exportify.features.users.model.RolUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        RolUser rol, // Opcional (si es null, el servicio asigna USER)
        String phoneNumber,
        String address
) {}