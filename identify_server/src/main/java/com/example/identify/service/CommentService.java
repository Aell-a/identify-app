package com.example.identify.service;

import com.example.identify.model.Comment;
import com.example.identify.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByPostId(Long postId) {
        return new ArrayList<>(commentRepository.findByPostId(postId));
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return new ArrayList<>(commentRepository.findByUserId(userId));
    }


}
