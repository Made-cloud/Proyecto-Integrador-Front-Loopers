package com.exportify.features.users.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "users")
//@Data???
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

    //@Column(name = "profile_photo")
    //private String profilePhoto;

}
