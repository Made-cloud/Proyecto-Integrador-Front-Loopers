package com.exportify.features.users.repository;

import com.exportify.features.users.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository <Users, Long>{

    // Para el Login y Security (Busca por email exacto)
    Optional<Users> findByEmailIgnoreCase(String email);

    // Devuelve true si existe, false si está libre.
    boolean existsByEmailIgnoreCase(String email);


}
