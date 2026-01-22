package com.exportify.features.users.controller;

import com.exportify.features.users.dto.UserRequest;
import com.exportify.features.users.dto.UserResponse;
import com.exportify.features.users.model.Users;
import com.exportify.features.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(service.createUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getForId(@PathVariable Long id){
        return ResponseEntity.ok(service.getForId(id));
    }

    @GetMapping
    public ResponseEntity<Iterable<UserResponse>> listUsers(){
        return ResponseEntity.ok(service.listUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PutMapping("/{id}/desactivate")
    public ResponseEntity<?> desactivate(@PathVariable Long id) {
        service.desactivate(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
