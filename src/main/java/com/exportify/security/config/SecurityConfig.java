package com.exportify.security.config;

import com.exportify.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // --- 1. ACCESO PÚBLICO (Cualquiera entra) ---
                        .requestMatchers("/auth/**").permitAll() // Login y Registro
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll() // Documentación

                        // --- 2. TIENDA DE CURSOS (Products) ---
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll() // Ver cursos: PÚBLICO
                        .requestMatchers("/products/**").hasAuthority("ADMIN")       // Crear/Editar: SOLO ADMIN

                        // --- 3. COMUNIDAD (Posts) ---
                        .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()    // Ver posts: PÚBLICO
                        .requestMatchers("/posts/**").authenticated()                // Publicar: USUARIO REGISTRADO

                        // --- 4. USUARIOS ---
                        .requestMatchers("/users/**").hasAuthority("ADMIN")          // Solo Admin ve la lista de usuarios

                        // --- RESTO ---
                        .anyRequest().authenticated() // Cualquier otra cosa pide Token
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}