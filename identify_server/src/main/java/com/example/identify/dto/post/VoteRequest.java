package com.example.identify.dto.post;

import lombok.Data;

@Data
public class VoteRequest {
    private Long userId;
    private Long postId;
    private Long commentId;
    private String targetType;
    private String voteType;
}
