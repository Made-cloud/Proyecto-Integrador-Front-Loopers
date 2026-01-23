package com.exportify.security.service;

import com.exportify.exception.BadRequestException;
import com.exportify.features.users.model.RolUser;
import com.exportify.features.users.model.Users;
import com.exportify.features.users.repository.UserRepository;
import com.exportify.security.dto.AuthRequest;
import com.exportify.security.dto.AuthResponse;
import com.exportify.security.dto.RegisterRequest;
import com.exportify.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // --- LOGIN ---
    public AuthResponse login(AuthRequest req) {
        // 1. Validar credenciales
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.email(), req.password()));

        // 2. Buscar usuario
        Users user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 3. Generar Token
        String jwt = jwtService.generateToken(user.getEmail());

        // 4. Responder con TODO (incluyendo el ID)
        // OJO: Aquí estaba el error, ahora pasamos 'jwt' y 'user.getId()'
        return new AuthResponse(jwt, user.getName(), user.getEmail(), user.getRol(), user.getId());
    }

    // --- REGISTER ---
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new BadRequestException("El email ya está registrado");
        }

        Users newUser = Users.builder()
                .name(req.name())
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .rol(req.rol() != null ? req.rol() : RolUser.USER)
                .phoneNumber(req.phoneNumber())
                .address(req.address())
                .active(true)
                .build();

        userRepository.save(newUser);
        String jwt = jwtService.generateToken(newUser.getEmail());

        return new AuthResponse(jwt, newUser.getName(), newUser.getEmail(), newUser.getRol(), newUser.getId());
    }
}