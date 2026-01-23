package com.exportify.security.config;

import com.exportify.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// --- NUEVAS IMPORTACIONES PARA CORS ---
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF (común en APIs REST)

                // --- ¡AQUÍ ACTIVAMOS LA CONFIGURACIÓN DE CORS! ---
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // --- 1. ACCESO PÚBLICO ---
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()

                        // --- 2. TIENDA (Products) ---
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers("/products/**").hasAuthority("ADMIN")

                        // --- 3. COMUNIDAD (Posts) ---
                        .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
                        .requestMatchers("/posts/**").authenticated()

                        // --- 4. USUARIOS (Reglas de Comunidad) ---
                        // Permitir a cualquier usuario LOGUEADO usar estas funciones:
                        .requestMatchers(HttpMethod.POST, "/users/*/follow/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/users/*/unfollow/*").authenticated()
                        .requestMatchers(HttpMethod.GET, "/users/*/following").authenticated()

                        // (Opcional) Si quieres que cualquiera pueda ver el perfil de otro usuario:
                        .requestMatchers(HttpMethod.GET, "/users/*").authenticated()

                        // --- 5. ADMINISTRACIÓN DE USUARIOS (Lo demás queda cerrado) ---
                        // Listar todos, borrar usuarios, etc. sigue siendo solo para ADMIN
                        .requestMatchers("/users/**").hasAuthority("ADMIN")

                        // --- RESTO ---
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- NUEVO MÉTODO: CONFIGURACIÓN DE REGLAS CORS ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. ¿Quién puede entrar? (Tu Frontend en Live Server)
        configuration.setAllowedOrigins(List.of("http://127.0.0.1:5500", "http://localhost:5500"));

        // 2. ¿Qué métodos permitimos?
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3. ¿Qué cabeceras dejamos pasar?
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // 4. Permitir credenciales
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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