package com.example.identify;

import com.example.identify.controller.PostController;
import com.example.identify.dto.post.*;
import com.example.identify.mapper.CommentMapper;
import com.example.identify.model.Post;
import com.example.identify.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PostControllerTest {

    @InjectMocks
    private PostController postController;

    @Mock
    private PostService postService;

    @Mock
    private CommentMapper commentMapper;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMainPagePosts() {
        List<MiniPostDTO> posts = new ArrayList<>();
        when(postService.getMiniPosts(0, 5)).thenReturn(posts);

        ResponseEntity<List<MiniPostDTO>> response = postController.getMainPagePosts(0, 5);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(posts, response.getBody());
    }

    @Test
    void testCreatePostSuccess() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setUserId(1L);
        postRequest.setTitle("Test Post");
        postRequest.setDescription("This is a test post.");

        ObjectMapper mapper = new ObjectMapper();
        String postRequestJSON = mapper.writeValueAsString(postRequest);

        List<MultipartFile> files = new ArrayList<>();
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getOriginalFilename()).thenReturn("test.jpg");
        files.add(file);

        Post newPost = new Post();
        newPost.setId(1L);
        when(postService.createPost(any(PostRequest.class))).thenReturn(newPost);

        ResponseEntity<?> response = postController.createPost(postRequestJSON, files);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody());
    }

    @Test
    void testCreatePostFailure() {
        PostRequest postRequest = new PostRequest();
        postRequest.setUserId(1L);
        List<MultipartFile> files = new ArrayList<>();

        ResponseEntity<?> response = postController.createPost("{}", files);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("At least one media file is required", response.getBody());
    }

    @Test
    void testGetPostSuccess() {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(1L);
        when(postService.getPostById(1L)).thenReturn(postDTO);

        ResponseEntity<PostDTO> response = postController.getPost(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(postDTO, response.getBody());
    }

    @Test
    void testGetPostNotFound() {
        when(postService.getPostById(1L)).thenReturn(null);

        ResponseEntity<PostDTO> response = postController.getPost(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}