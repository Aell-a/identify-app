package com.example.identify.controller;

import com.example.identify.dto.ApiResponse;
import com.example.identify.dto.media.MediaRequest;
import com.example.identify.dto.post.*;
import com.example.identify.exception.PostCreationException;
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
import java.util.ArrayList;

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
        List<MiniPostDTO> posts = postService.getMiniPosts(page, size);
        if (posts != null) {
            posts.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
            return ResponseEntity.ok(posts);
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
                                      @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            PostRequest postRequest = mapper.readValue(postRequestJSON, PostRequest.class);
            System.out.println(postRequest);

            List<MediaRequest> mediaRequests = files != null ? files.stream()
                    .map(file -> {
                        MediaRequest mediaRequest = new MediaRequest();
                        mediaRequest.setFile(file);
                        return mediaRequest;
                    })
                    .collect(Collectors.toList()) : new ArrayList<>();
            postRequest.setMediaRequests(mediaRequests);

            Post newPost = postService.createPost(postRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, newPost.getId(), null));

        } catch (PostCreationException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/comment/{postId}")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId, @RequestBody String req) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        CommentRequest commentRequest;
        try {
            commentRequest = objectMapper.readValue(req, CommentRequest.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        Comment newComment = postService.addComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentMapper.toCommentDTO(newComment));
    }

    @PostMapping("/vote")
    public ResponseEntity<?> handleVote(@RequestBody VoteRequest voteRequest) {
        if (voteRequest.getUserId() != null && voteRequest.getPostId() != null) {
            Post post = postService.handleVote(voteRequest);
            return ResponseEntity.ok(postService.getPostById(post.getId()));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/resolve/{postId}")
    public ResponseEntity<?> handleResolve(@PathVariable Long postId, @RequestBody Long commentId) {
        if (postService.getPostById(postId) != null) {
            postService.handleResolution(postId, commentId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<MiniPostDTO>> searchPosts(@RequestParam(required = false) String color,
                                                     @RequestParam(required = false) String shape,
                                                     @RequestParam(required = false) String material,
                                                     @RequestParam(required = false) String wikidataLabelTitle) {
        List<MiniPostDTO> posts = postService.searchPosts(color, shape, material, wikidataLabelTitle);
        return ResponseEntity.ok(posts);
    }
}
