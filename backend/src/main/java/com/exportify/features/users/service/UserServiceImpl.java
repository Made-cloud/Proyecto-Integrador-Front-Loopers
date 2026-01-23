package com.exportify.features.users.service;

import com.exportify.exception.BadRequestException;
import com.exportify.exception.NotFoundException;
import com.exportify.features.users.dto.UserRequest;
import com.exportify.features.users.dto.UserResponse;
import com.exportify.features.users.mapper.UserMapper;
import com.exportify.features.users.model.Users;
import com.exportify.features.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder; // Inyectamos el encriptador

    @Override
    public UserResponse createUser(UserRequest request) {
        // 1. VALIDACIÓN: El email no debe repetirse
        if (repository.existsByEmailIgnoreCase(request.email())) {
            throw new BadRequestException("El email ya está registrado");
        }

        // 2. ENCRIPTAR la contraseña
        String hash = passwordEncoder.encode(request.password());

        // 3. MAPPER (Pasamos el Request Y el Hash)
        Users user = UserMapper.toNewEntity(request, hash);

        // 4. GUARDAR Y RESPONDER
        return UserMapper.toResponse(repository.save(user));
    }

    @Override
    public UserResponse getForId(Long id) {
        return repository.findById(id)
                .map(UserMapper::toResponse) // Convertimos si lo encuentra
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Override
    public List<UserResponse> listUsers() {
        // Convertimos la lista de Entidades a lista de Responses
        return repository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {
        // 1. Buscar
        Users user = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + id));

        // 2. Preparar Hash (solo si mandaron contraseña nueva)
        String newHash = null;
        if (request.password() != null && !request.password().isBlank()) {
            newHash = passwordEncoder.encode(request.password());
        }

        // 3. ACTUALIZAR INTELIGENTE (Usando el método nuevo del Mapper)
        UserMapper.updateEntity(user, request, newHash);

        // 4. Guardar
        return UserMapper.toResponse(repository.save(user));
    }

    @Override
    public void delete(Long id) {
        if(!repository.existsById(id)) throw new NotFoundException("Usuario no encontrado");
        repository.deleteById(id);
    }

    @Override
    public void desactivate(Long id){
        // Borrado Lógico: Es más seguro para un negocio
        Users users = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + id));
        users.setActive(false);
        repository.save(users);
    }
    private static boolean isBlank(String str) {
        return str == null || str.isBlank();
    }

    //        IMPLEMENTACIÓN DE SEGUIDORES
    @Override
    @Transactional // Importante para guardar la relación en la DB
    public void followUser(Long myId, Long targetId) {
        if (myId.equals(targetId)) {
            throw new BadRequestException("No puedes seguirte a ti mismo 😅");
        }

        Users me = repository.findById(myId)
                .orElseThrow(() -> new NotFoundException("Usuario origen no encontrado ID: " + myId));

        Users target = repository.findById(targetId)
                .orElseThrow(() -> new NotFoundException("Usuario a seguir no encontrado ID: " + targetId));

        // Agregamos a la lista de seguidos
        me.getFollowing().add(target);

        // Guardamos (Hibernate actualiza la tabla intermedia user_follows)
        repository.save(me);
    }

    @Override
    @Transactional
    public void unfollowUser(Long myId, Long targetId) {
        Users me = repository.findById(myId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        Users target = repository.findById(targetId)
                .orElseThrow(() -> new NotFoundException("Usuario destino no encontrado"));

        // Removemos de la lista
        me.getFollowing().remove(target);
        repository.save(me);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getFollowingList(Long myId) {
        Users me = repository.findById(myId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado ID: " + myId));

        // Obtenemos el Set de usuarios y lo convertimos a lista de UserResponse
        return me.getFollowing().stream()
                .map(UserMapper::toResponse)
                .collect(Collectors.toList());
    }


}