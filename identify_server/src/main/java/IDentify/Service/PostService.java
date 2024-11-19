package IDentify.Service;

import IDentify.DTO.Post.MiniPostDTO;
import IDentify.DTO.Post.PostDTO;
import IDentify.DTO.Post.PostRequest;
import IDentify.Entity.*;
import IDentify.Mapper.PostMapper;
import IDentify.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMapper postMapper;
    @Autowired
    private MediaService mediaService;

    public List<PostDTO> getPosts(int page, int size) {
        Page<Post> posts = postRepository.findAll(PageRequest.of(page, size));
        return posts.stream()
                .map(postMapper::toPostDTO)
                .collect(Collectors.toList());
    }

    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toPostDTO(post);
    }

    public List<PostDTO> getAllPostsByUserId(Long userId) {
        return postRepository.findAllByUserId(userId).stream()
                .map(postMapper::toPostDTO)
                .collect(Collectors.toList());
    }

    public List<PostDTO> getAllByTagId(Long tagId) {
        return postRepository.findAllByTagId(tagId).stream()
                .map(postMapper::toPostDTO)
                .collect(Collectors.toList());
    }

    public List<MiniPostDTO> getMiniPosts(int page, int size) {
        Page<Post> posts = postRepository.findAll(PageRequest.of(page, size));
        return posts.stream()
                .map(postMapper::toMiniPostDTO)
                .collect(Collectors.toList());
    }

    public List<MiniPostDTO> getAllMiniPostsByUserId(Long userId) {
        return postRepository.findAllByUserId(userId).stream()
                .map(postMapper::toMiniPostDTO)
                .collect(Collectors.toList());
    }

    public List<MiniPostDTO> getAllMiniPostsByTagId(Long tagId) {
        return postRepository.findAllByTagId(tagId).stream()
                .map(postMapper::toMiniPostDTO)
                .collect(Collectors.toList());
    }

    public Post createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setUserId(postRequest.getUserId());
        post.setTitle(postRequest.getTitle());
        post.setDescription(postRequest.getDescription());

        Mystery mystery = new Mystery();
        mystery.setWeight(postRequest.getWeight());
        mystery.setColors(postRequest.getColors());
        mystery.setShapes(postRequest.getShapes());
        mystery.setMaterials(postRequest.getMaterials());
        mystery.setSizeX(postRequest.getSizeX());
        mystery.setSizeY(postRequest.getSizeY());
        mystery.setSizeZ(postRequest.getSizeZ());
        if (postRequest.getMediaRequests() != null && !postRequest.getMediaRequests().isEmpty()) {
            List<Media> mediaList = postRequest.getMediaRequests().stream()
                    .map(mediaRequest -> {
                        try {
                            return mediaService.uploadMedia(mediaRequest.getFile(), postRequest.getUserId());
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload media", e);
                        }
                    })
                    .toList();
            mystery.setMedias(mediaList);
        }
        if (postRequest.getLabelRequests() != null && !postRequest.getLabelRequests().isEmpty()) {
            List<WikidataLabel> labelList = postRequest.getLabelRequests().stream()
                    .map(labelRequest -> {
                        WikidataLabel label = new WikidataLabel();
                        label.setWikidataId(labelRequest.getWikidataId());
                        label.setDescription(labelRequest.getDescription());
                        label.setTitle(labelRequest.getTitle());
                        label.setRelatedLabels(labelRequest.getRelatedLabels());
                        return label;
                    })
                    .toList();
            mystery.setWikidataLabels(labelList);
        }
        post.setMystery(mystery);
        post.setStatus(PostStatus.ACTIVE);
        return postRepository.save(post);
    }
}
