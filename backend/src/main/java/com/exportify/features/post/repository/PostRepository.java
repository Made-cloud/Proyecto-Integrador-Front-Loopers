package com.exportify.features.post.repository;

import com.exportify.features.post.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Traer todos los posts ordenados por fecha (el más nuevo primero)
    List<Post> findAllByOrderByCreatedAtDesc();

    // Buscar posts de un usuario específico
    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long userId);
}