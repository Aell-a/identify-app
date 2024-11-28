package com.example.identify.controller;
import com.example.identify.model.Comment;
import com.example.identify.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getPostComments(@PathVariable Long postId) {
        if (commentService.getCommentsByPostId(postId) != null) {
            return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Comment>> getUserComments(@PathVariable Long userId) {
        if (commentService.getCommentsByUserId(userId) != null) {
            return ResponseEntity.ok(commentService.getCommentsByUserId(userId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
