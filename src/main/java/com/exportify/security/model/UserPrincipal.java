package com.exportify.security.model;

import com.exportify.features.users.model.RolUser;
import com.exportify.features.users.model.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final Users user;

    public UserPrincipal(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertimos el RolUser (USER, ADMIN) a un formato que Spring entienda (ROLE_USER)
        RolUser rol = user.getRol();
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash(); // <--- Aquí conectamos con el campo 'passwordHash'
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // <--- En el sistema, el 'username' es el email
    }

    // --- Configuraciones estándar (las dejamos en true por ahora) ---
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        return user.isActive(); // <--- Conectado a tu Soft Delete (campo 'active')
    }

    // Método extra para recuperar el objeto Users completo si lo necesitamos después
    public Users getUser() { return user; }
}