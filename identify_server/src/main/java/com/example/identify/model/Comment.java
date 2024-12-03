package com.example.identify.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private CommentType type;
    private Long parentId;
    private Long userId;

    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private int upvotes = 0;
    private int downvote = 0;
    private int totalPoints = 0;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
