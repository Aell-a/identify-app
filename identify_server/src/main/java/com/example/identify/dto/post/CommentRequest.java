package com.example.identify.dto.post;

import lombok.Data;

@Data
public class CommentRequest {
    private Long parentId;
    private Long postId;
    private Long userId;
    private String content;
    private String type;
}
