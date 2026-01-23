package com.exportify.features.users.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_users")
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 9, nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private RolUser rol = RolUser.USER;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    // ✅ 1. FOTO DE PERFIL (Descomentado y listo para usar)
    // Guardaremos aquí la URL de la imagen (ej: "https://cloudinary...")
    @Column(name = "profile_photo")
    private String profilePhoto;

    // ✅ 2. SISTEMA DE SEGUIDORES (Relación Muchos a Muchos)
    // Un usuario puede seguir a muchos, y esa relación se guarda en una tabla "user_follows"
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_follows",
            joinColumns = @JoinColumn(name = "follower_id"), // Yo (el que da click a seguir)
            inverseJoinColumns = @JoinColumn(name = "followed_id") // El ídolo (al que sigo)
    )
    @Builder.Default // Para que Lombok no lo ponga en null al construir
    private Set<Users> following = new HashSet<>();

}