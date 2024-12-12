package com.example.identify.dto.post;

import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.CommentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long parentId;
    private Long postId;
    private String content;
    private CommentType type;
    private LocalDateTime createdAt;
    private MiniProfile user;
    private int upvotes;
    private Set<Long> upvotedUserIds;
    private int downvotes;
    private Set<Long> downvotedUserIds;
}
