package com.exportify.features.users.dto;

import com.exportify.features.users.model.RolUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String name,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Formato de correo inválido")
        @Size(max = 254, message = "El correo es demasiado largo")
        String email,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 500, message = "La dirección no puede exceder 500 caracteres")
        String address,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        // OJO: Aquí validamos el largo de la contraseña REAL (la que escribe el usuario), no el hash.
        String password,

        RolUser rol,

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(max = 15)
        @Pattern(regexp = "^\\+?[0-9\\s-]{7,20}$", message = "El teléfono debe tener exactamente 9 números")
        String phoneNumber,

        Boolean active
){}
