package com.exportify.features.post.controller;

import com.exportify.features.post.dto.PostRequest;
import com.exportify.features.post.dto.PostResponse;
import com.exportify.features.post.service.PostServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostServiceImpl service;

    // Crear Post
    @PostMapping
    public ResponseEntity<PostResponse> create(@RequestBody PostRequest request) {
        return ResponseEntity.ok(service.createPost(request));
    }

    // Listar TODOS (Para comunidad)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAll() {
        return ResponseEntity.ok(service.getAllPosts());
    }

    // Listar por Usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getPostsByUser(userId));
    }

    // Borrar Post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        service.deletePost(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}