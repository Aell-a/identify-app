package com.example.identify.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private int downvotes = 0;

    @ElementCollection
    private Set<Long> upvotedUserIds = new HashSet<>();

    @ElementCollection
    private Set<Long> downvotedUserIds = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
