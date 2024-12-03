package com.example.identify.dto.post;

import com.example.identify.model.CommentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long postId;
    private String content;
    private CommentType type;
    private LocalDateTime createdAt;
}
