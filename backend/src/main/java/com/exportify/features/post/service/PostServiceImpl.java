package com.exportify.features.post.service;

import com.exportify.features.post.dto.PostRequest;
import com.exportify.features.post.dto.PostResponse;
import com.exportify.features.post.model.Post;
import com.exportify.features.post.repository.PostRepository;
import com.exportify.features.users.model.RolUser;
import com.exportify.features.users.model.Users;
import com.exportify.features.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // --- CREAR (Sin cambios) ---
    public PostResponse createPost(PostRequest request) {
        Users author = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Post post = Post.builder()
                .content(request.content())
                .imageUrl(request.imageUrl())
                .author(author)
                .likesCount(0)
                .active(true)
                .censored(false)
                .build();

        return toResponse(postRepository.save(post));
    }

    // --- LISTAR ---
    public List<PostResponse> getAllPosts() {
        // Solo mostramos los activos (active = true)
        // Nota: Los censurados por Admin siguen siendo "active = true" para mostrar el mensaje de castigo
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(Post::isActive)
                .map(this::toResponse)
                .toList();
    }

    // --- EDITAR (Solo el dueño) ---
    public PostResponse updatePost(Long postId, PostRequest request, String emailUsuarioActual) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        // Validamos que el usuario que intenta editar sea el dueño
        if (!post.getAuthor().getEmail().equals(emailUsuarioActual)) {
            throw new RuntimeException("No tienes permiso para editar este post. Solo el autor puede hacerlo.");
        }

        // Si el post está censurado por Admin, ya no se puede editar
        if (post.isCensored()) {
            throw new RuntimeException("Este post fue bloqueado por un administrador y no se puede editar.");
        }

        // Actualizamos contenido
        post.setContent(request.content());
        // Si mandan nueva imagen, la actualizamos
        if (request.imageUrl() != null) {
            post.setImageUrl(request.imageUrl());
        }

        return toResponse(postRepository.save(post));
    }

    // --- ELIMINAR (Lógica dual: Usuario vs Admin) ---
    public void deletePost(Long postId, String emailUsuarioActual) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        Users usuarioActual = userRepository.findByEmailIgnoreCase(emailUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));

        boolean esElDuenio = post.getAuthor().getEmail().equals(emailUsuarioActual);
        boolean esAdmin = usuarioActual.getRol() == RolUser.ADMIN;

        if (esAdmin) {
            // CASO 1: ADMIN ELIMINA (CENSURA)
            // No lo borramos, cambiamos el texto y lo marcamos como censurado.
            post.setContent("⛔ Este post ha sido eliminado por incumplir con nuestras políticas de comunidad.");
            post.setImageUrl(null); // Borramos la imagen si tenía
            post.setCensored(true);
            // active se queda en true para que el mensaje sea visible en el feed
            postRepository.save(post);

        } else if (esElDuenio) {
            // CASO 2: DUEÑO ELIMINA
            // Soft delete: Lo ocultamos totalmente del feed.
            post.setActive(false);
            postRepository.save(post);

        } else {
            // CASO 3: INTRUSO
            throw new RuntimeException("No tienes permisos para eliminar este post.");
        }
    }

    // Mapper auxiliar
    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getContent(),
                post.getImageUrl(),
                post.getAuthor().getName(),
                "https://i.pravatar.cc/150?u=" + post.getAuthor().getId(),
                post.getLikesCount(),
                post.getCreatedAt()
        );
    }
}