package com.exportify.features.post.model;

import com.exportify.features.users.model.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users author;

    private int likesCount;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // --- NUEVOS CAMPOS DE CONTROL ---

    private boolean active; // false = Eliminado por el usuario (invisible)

    private boolean censored; // true = Eliminado por Admin (mensaje de bloqueo)
}