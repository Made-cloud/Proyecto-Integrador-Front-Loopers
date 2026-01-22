package com.exportify.features.post.controller;

import com.exportify.features.post.dto.PostRequest;
import com.exportify.features.post.dto.PostResponse;
import com.exportify.features.post.service.PostServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Importante
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostServiceImpl service;

    @PostMapping
    public ResponseEntity<PostResponse> create(@RequestBody PostRequest request) {
        return ResponseEntity.ok(service.createPost(request));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAll() {
        return ResponseEntity.ok(service.getAllPosts());
    }

    // --- NUEVO: EDITAR ---
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> update(@PathVariable Long id,
                                               @RequestBody PostRequest request,
                                               Authentication authentication) {
        // authentication.getName() nos da el email del usuario logueado (sacado del Token)
        String userEmail = authentication.getName();
        return ResponseEntity.ok(service.updatePost(id, request, userEmail));
    }

    // --- NUEVO: ELIMINAR ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       Authentication authentication) {
        String userEmail = authentication.getName();
        service.deletePost(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}