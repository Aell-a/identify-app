package com.example.identify.mapper;

import com.example.identify.dto.post.CommentDTO;
import com.example.identify.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentDTO toCommentDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .type(comment.getType())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
