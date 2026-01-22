package com.exportify.security.model;

import com.exportify.features.users.model.Users;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private final Users user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user.getRol() == null) return Collections.emptyList();

        // OJO: Le pasamos el nombre del rol "a secas" (ej: ADMIN)
        // para que coincida exacto con lo que pusimos en el SecurityConfig.
        // Si le agregamos "ROLE_" al principio, Spring no lo va a encontrar.
        return List.of(new SimpleGrantedAuthority(user.getRol().name()));
    }

    @Override
    public String getPassword() {
        // Conectamos con la contraseña encriptada de la BD
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        // Usamos el email como identificador único para el login
        return user.getEmail();
    }

    // --- Flags de estado de la cuenta ---
    // Por ahora devolvemos true en todo para no complicar el login,
    // pero aquí podrías validar si el usuario está baneado o si expiró su cuenta.

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        // Respetamos el soft-delete: si active es false, no entra
        return user.isActive();
    }
}