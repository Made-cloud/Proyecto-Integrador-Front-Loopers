package com.exportify.security.service;

import com.exportify.exception.BadRequestException;
import com.exportify.features.users.model.RolUser;
import com.exportify.features.users.model.Users; // O 'Users' si no cambiaste el nombre
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
        // 1. Autenticar credenciales (Email y Password)
        // Spring Security revisa si coinciden. Si no, lanza error automáticamente.
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.email(),
                req.password() // En tu DTO debe llamarse 'password'
        ));

        // 2. Buscar usuario para sacar sus datos
        Users user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 3. Generar el Token
        String jwt = jwtService.generateToken(user.getEmail());

        // 4. Responder
        return new AuthResponse(user.getName(), user.getEmail(), user.getRol(), jwt);
    }

    // --- REGISTER (Registro público) ---
    public AuthResponse register(RegisterRequest req) {
        // 1. Validar que no exista el email
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new BadRequestException("El email ya está registrado");
        }

        // 2. Crear el nuevo usuario (usando Builder)
        Users newUser = Users.builder()
                .name(req.name())
                .email(req.email())
                // ¡IMPORTANTE! Encriptar la contraseña
                .passwordHash(passwordEncoder.encode(req.password()))
                // Si no envían rol, asignamos USER por defecto
                .rol(req.rol() != null ? req.rol() : RolUser.USER)
                .phoneNumber(req.phoneNumber())
                .address(req.address())
                .active(true)
                .build();

        // 3. Guardar en BD
        userRepository.save(newUser);

        // 4. Generar Token para que quede logueado automáticamente
        String jwt = jwtService.generateToken(newUser.getEmail());

        return new AuthResponse(newUser.getName(), newUser.getEmail(), newUser.getRol(), jwt);
    }
}
