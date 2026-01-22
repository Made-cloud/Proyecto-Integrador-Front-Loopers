package com.exportify.security.jwt; // <--- ÚNICO CAMBIO IMPORTANTE

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMs;

    public JwtService(Environment env) {
        // 1) Tomar primero del Environment (incluye .env), luego del Sistema Operativo
        String secret = env.getProperty("JWT_SECRET");
        if (secret == null || secret.isBlank()) secret = System.getenv("JWT_SECRET");

        String expStr = env.getProperty("JWT_EXPIRATION_MS");
        if (expStr == null || expStr.isBlank()) expStr = System.getenv("JWT_EXPIRATION_MS");

        // Validaciones para que no arranque si faltan datos
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("ERROR FATAL: JWT_SECRET no está definido en .env o variables de entorno");
        }
        if (expStr == null || expStr.isBlank()) {
            throw new IllegalStateException("ERROR FATAL: JWT_EXPIRATION_MS no está definido en .env o variables de entorno");
        }

        long exp;
        try {
            exp = Long.parseLong(expStr);
        } catch (NumberFormatException e) {
            throw new IllegalStateException("JWT_EXPIRATION_MS debe ser un número (en milisegundos)");
        }

        if (exp <= 0) throw new IllegalStateException("JWT_EXPIRATION_MS debe ser mayor a 0");

        // 2) Intentar decodificar como Base64; si falla, usar como texto plano (pero debe ser largo)
        Key key;
        try {
            byte[] decoded = Base64.getDecoder().decode(secret);
            // HMAC-SHA256 necesita 256 bits (32 bytes)
            if (decoded.length < 32) throw new IllegalArgumentException("La clave Base64 es muy corta (< 32 bytes)");
            key = Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException notBase64) {
            // Si no es Base64 válido o es muy corta, probamos como texto plano
            byte[] raw = secret.getBytes(StandardCharsets.UTF_8);
            if (raw.length < 32) {
                throw new IllegalStateException("Por seguridad, el JWT_SECRET debe tener al menos 32 caracteres.");
            }
            key = Keys.hmacShaKeyFor(raw);
        }

        this.signingKey = key;
        this.expirationMs = exp;
    }

    // Generar token simple (solo subject)
    public String generateToken(String subject) {
        return generateToken(subject, Map.of());
    }

    // Generar token con Claims extra (roles, etc.)
    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extraer usuario (email) del token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validar si el token es auténtico y no ha expirado
    public boolean isTokenValid(String token, String username) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Verifica que el email coincida y que la fecha de expiración sea futura
            return username.equalsIgnoreCase(claims.getSubject())
                    && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token inválido, firma mala o expirado
        }
    }
}