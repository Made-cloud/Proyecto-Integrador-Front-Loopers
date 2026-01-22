package com.exportify.security.service;

import com.exportify.features.users.model.Users;
import com.exportify.features.users.repository.UserRepository;
import com.exportify.security.model.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscamos el usuario en TU base de datos usando tu repositorio
        Users user = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));

        // Convertimos tu usuario 'Users' a un objeto que Spring Security entienda ('UserPrincipal')
        return new UserPrincipal(user);
    }
}
