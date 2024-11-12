package IDentify.Controller;

import IDentify.DTO.Post.MiniPostDTO;
import IDentify.DTO.Post.PostDTO;
import IDentify.DTO.Post.PostRequest;
import IDentify.Entity.Post;
import IDentify.Mapper.PostMapper;
import IDentify.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private PostMapper postMapper;

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

    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(@RequestBody PostRequest postRequest) {
        Post newPost = postService.createPost(postRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(postMapper.toPostDTO(newPost));
    }
}
