package com.example.identify.controller;

import com.example.identify.dto.media.MediaRequest;
import com.example.identify.dto.post.*;
import com.example.identify.mapper.CommentMapper;
import com.example.identify.model.Comment;
import com.example.identify.model.Post;
import com.example.identify.service.PostService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private CommentMapper commentMapper;
    @Qualifier("objectMapper")
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/main")
    public ResponseEntity<List<MiniPostDTO> > getMainPagePosts(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "5") int size) {
        if (postService.getMiniPosts(page, size) != null) {
            return ResponseEntity.ok(postService.getMiniPosts(page, size));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MiniPostDTO>> getPostsByUserId(@PathVariable Long userId) {
        if (postService.getAllMiniPostsByUserId(userId) != null) {
            return ResponseEntity.ok(postService.getAllMiniPostsByUserId(userId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<MiniPostDTO>> getPostsByTagId(@PathVariable Long tagId) {
        if (postService.getAllMiniPostsByTagId(tagId) != null) {
            return ResponseEntity.ok(postService.getAllMiniPostsByTagId(tagId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long postId) {
        if (postService.getPostById(postId) != null) {
            return ResponseEntity.ok(postService.getPostById(postId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(@RequestPart("postRequest") String postRequestJSON,
                                        @RequestPart("files") List<MultipartFile> files) {
        try {
            if (files == null || files.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("At least one media file is required");
            }

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            PostRequest postRequest = mapper.readValue(postRequestJSON, PostRequest.class);

            if (postRequest.getUserId() == null) {
                return ResponseEntity
                        .badRequest()
                        .body("User ID is required");
            }

            List<MediaRequest> mediaRequests = files.stream()
                    .map(file -> {
                        MediaRequest mediaRequest = new MediaRequest();
                        mediaRequest.setFile(file);
                        return mediaRequest;
                    })
                    .collect(Collectors.toList());
            postRequest.setMediaRequests(mediaRequests);

            Post newPost = postService.createPost(postRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newPost.getId());

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create post: " + e.getMessage());
        }
    }

    @PostMapping("/comment/{postId}")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId, @RequestBody String req) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        CommentRequest commentRequest = new CommentRequest();
        try {
            commentRequest = objectMapper.readValue(req, CommentRequest.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        Comment newComment = postService.addComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentMapper.toCommentDTO(newComment));
    }
}
