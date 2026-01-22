package com.exportify.features.users.mapper;

import com.exportify.features.users.dto.UserRequest;
import com.exportify.features.users.dto.UserResponse;
import com.exportify.features.users.model.RolUser;
import com.exportify.features.users.model.Users;

public class UserMapper {

    public static UserResponse toResponse(Users user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRol(),
                user.getAddress(),
                user.getPhoneNumber(),
                user.isActive()
        );
    }

    public static Users toNewEntity(UserRequest request, String passwordHashEncrip) {
        return Users.builder()
                .name(request.name())
                .email(request.email())
                .address(request.address())
                .phoneNumber(request.phoneNumber())
                .passwordHash(passwordHashEncrip)
                .rol(request.rol() != null ? request.rol() : RolUser.USER)
                .active(request.active() == null || request.active())
                .build();
    }

    public static void updateEntity(Users currentUser, UserRequest request, String newHashOrNull) {
        if (request.name() != null) currentUser.setName(request.name());
        if (request.email() != null) currentUser.setEmail(request.email());
        if (request.address() != null) currentUser.setAddress(request.address());
        if (request.phoneNumber() != null) currentUser.setPhoneNumber(request.phoneNumber());
        if (request.rol() != null) currentUser.setRol(request.rol());
        if (request.active() != null) currentUser.setActive(request.active());

        if (newHashOrNull != null) {
            currentUser.setPasswordHash(newHashOrNull);
        }
    }
}