package com.example.identify.mapper;

import com.example.identify.dto.post.CommentDTO;
import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.Comment;
import com.example.identify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    @Autowired
    UserService userService;

    public CommentDTO toCommentDTO(Comment comment) {
        MiniProfile user = userService.getMiniProfile(comment.getUserId());
        return CommentDTO.builder()
                .id(comment.getId())
                .parentId(comment.getParentId())
                .postId(comment.getPost().getId())
                .upvotes(comment.getUpvotes())
                .downvotes(comment.getDownvotes())
                .content(comment.getContent())
                .type(comment.getType())
                .createdAt(comment.getCreatedAt())
                .user(user)
                .build();
    }
}
