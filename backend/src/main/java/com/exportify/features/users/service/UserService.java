package com.exportify.features.users.service;

import com.exportify.features.users.dto.UserRequest;
import com.exportify.features.users.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getForId(Long id);
    UserResponse update(Long id, UserRequest request);
    void delete(Long id);
    void desactivate(Long id);
    List<UserResponse> listUsers();

}
