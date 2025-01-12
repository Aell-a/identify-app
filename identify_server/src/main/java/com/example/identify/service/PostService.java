package com.example.identify.service;

import com.example.identify.dto.post.*;
import com.example.identify.dto.user.MiniProfile;
import com.example.identify.exception.MediaUploadException;
import com.example.identify.exception.PostCreationException;
import com.example.identify.mapper.CommentMapper;
import com.example.identify.model.*;
import com.example.identify.mapper.PostMapper;
import com.example.identify.repository.CommentRepository;
import com.example.identify.repository.PostRepository;
import com.example.identify.repository.UserRepository;
import com.example.identify.repository.WikidataLabelRepository;
import com.example.identify.util.StringUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PostService {
    public final PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    @Autowired
    private WikidataLabelRepository wikidataLabelRepository;
    @Autowired
    private PostMapper postMapper;
    @Autowired
    private MediaService mediaService;
    @Autowired
    private UserService userService;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentMapper commentMapper;

    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
        List<CommentDTO> comments = post.getComments()
                .stream()
                .map(commentMapper::toCommentDTO)
                .toList();
        return postMapper.toPostDTO(post, miniProfile, comments);
    }

    public List<MiniPostDTO> getMiniPosts(int page, int size) {
        Page<Post> posts = postRepository.findAll(PageRequest.of(page, size));
        return posts.stream()
                .map(post -> {
                    MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
                    return postMapper.toMiniPostDTO(post, miniProfile);
                })
                .collect(Collectors.toList());
    }

    public List<MiniPostDTO> getAllMiniPostsByUserId(Long userId) {
        return postRepository.findAllByUserId(userId).stream()
                .map(post -> {
                    MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
                    return postMapper.toMiniPostDTO(post, miniProfile);
                })
                .collect(Collectors.toList());
    }

    public List<MiniPostDTO> getAllMiniPostsByTagId(Long tagId) {
        return postRepository.findAllByTagId(tagId).stream()
                .map(post -> {
                    MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
                    return postMapper.toMiniPostDTO(post, miniProfile);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Post createPost(PostRequest postRequest) throws PostCreationException {
        try {
            validatePostRequest(postRequest);
            
            Post post = new Post();
            post.setUserId(postRequest.getUserId());
            post.setTitle(postRequest.getTitle());
            post.setDescription(postRequest.getDescription());

            Mystery mystery = createMystery(postRequest);
            List<Media> mediaList = processMediaFiles(postRequest);
            mystery.setMedias(mediaList);
            
            if (postRequest.getLabelRequests() != null && !postRequest.getLabelRequests().isEmpty()) {
                List<WikidataLabel> labelList = processWikidataLabels(postRequest);
                mystery.setWikidataLabels(labelList);
            }
            
            post.setMystery(mystery);
            post.setStatus(PostStatus.ACTIVE);
            
            return postRepository.save(post);
        } catch (PostCreationException e) {
            throw e;
        } catch (Exception e) {
            throw new PostCreationException("Failed to create post: " + e.getMessage(), e);
        }
    }

    private void validatePostRequest(PostRequest postRequest) throws PostCreationException {
        if (StringUtil.isNullOrEmpty(postRequest.getTitle())) {
            throw new PostCreationException("Title is required");
        }
        if (StringUtil.isNullOrEmpty(postRequest.getDescription())) {
            throw new PostCreationException("Description is required");
        }
        if (postRequest.getMediaRequests() == null || postRequest.getMediaRequests().isEmpty()) {
            throw new PostCreationException("At least one media file is required");
        }
    }

    private Mystery createMystery(PostRequest postRequest) {
        Mystery mystery = new Mystery();
        mystery.setWeight(postRequest.getWeight());
        mystery.setColors(postRequest.getColors());
        mystery.setShapes(postRequest.getShapes());
        mystery.setMaterials(postRequest.getMaterials());
        mystery.setSizeX(postRequest.getSizeX());
        mystery.setSizeY(postRequest.getSizeY());
        mystery.setSizeZ(postRequest.getSizeZ());
        return mystery;
    }

    private List<Media> processMediaFiles(PostRequest postRequest) throws PostCreationException {
        try {
            return postRequest.getMediaRequests().stream()
                    .map(mediaRequest -> {
                        try {
                            validateMediaFile(mediaRequest.getFile());
                            return mediaService.uploadMedia(mediaRequest.getFile(), postRequest.getUserId());
                        } catch (MediaUploadException e) {
                            throw new PostCreationException("Media upload failed: " + e.getMessage());
                        }
                    })
                    .toList();
        } catch (Exception e) {
            throw new PostCreationException("Error processing media files: " + e.getMessage());
        }
    }

    private void validateMediaFile(MultipartFile file) throws PostCreationException {
        if (file == null || file.isEmpty()) {
            throw new PostCreationException("Invalid media file");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !isValidMediaType(contentType)) {
            throw new PostCreationException("Invalid file format. Supported formats: JPG, PNG");
        }
        
        if (file.getSize() > 10_000_000) { // 10MB limit
            throw new PostCreationException("File size exceeds maximum limit of 10MB");
        }
    }

    private boolean isValidMediaType(String contentType) {
        return contentType.equals("image/jpeg") ||
               contentType.equals("image/png");
    }

    private List<WikidataLabel> processWikidataLabels(PostRequest postRequest) {
        return postRequest.getLabelRequests().stream()
                .map(labelRequest -> wikidataLabelRepository
                        .findById(labelRequest.getWikidataId())
                        .orElseGet(() -> {
                            WikidataLabel newLabel = new WikidataLabel();
                            newLabel.setWikidataId(labelRequest.getWikidataId());
                            newLabel.setTitle(labelRequest.getTitle());
                            newLabel.setDescription(labelRequest.getDescription());
                            newLabel.setRelatedLabels(labelRequest.getRelatedLabels());
                            return wikidataLabelRepository.save(newLabel);
                        }))
                .toList();
    }

    public Comment addComment(CommentRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment();
        comment.setParentId(request.getParentId());
        comment.setUserId(request.getUserId());
        comment.setContent(request.getContent());
        if (request.getParentId() != null) {
            comment.setType(CommentType.REPLY);
        } else {
            CommentType type;
            if (Objects.equals(request.getType(), "Deep Dive")) {
                type = CommentType.DEEPDIVE;
            } else {
                type = CommentType.fromString(request.getType());
            }
            comment.setType(type);
        }
        comment.setPost(post);
        post.getComments().add(comment);
        post.setNumberOfComments(post.getNumberOfComments() + 1);
        commentRepository.save(comment);
        postRepository.save(post);
        return comment;
    }

    public Post handleVote(VoteRequest voteRequest) {
        User voter = userRepository.findById(voteRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(voteRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (voteRequest.getTargetType().equals("post")) {
            User poster = userRepository.findById(post.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (voteRequest.getVoteType().equals("upvote")) {
                post.getUpvotedUserIds().add(voter.getId());
                post.setUpvotes(post.getUpvotedUserIds().size());
                poster.setUpvotes(poster.getUpvotes() + 1);
                poster.setTotalPoints(poster.getTotalPoints() + 1);
            } else {
                post.getDownvotedUserIds().add(voter.getId());
                post.setDownvotes(post.getDownvotedUserIds().size());
                poster.setDownvotes(poster.getDownvotes() + 1);
                poster.setTotalPoints(poster.getTotalPoints() - 1);
            }
            userRepository.save(poster);
        } else {
            Comment comment = commentRepository.findByPostAndCommentId(voteRequest.getPostId(), voteRequest.getCommentId());
            User commenter = userRepository.findById(comment.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (voteRequest.getVoteType().equals("upvote")) {
                comment.getUpvotedUserIds().add(voter.getId());
                comment.setUpvotes(comment.getUpvotedUserIds().size());
                commenter.setUpvotes(commenter.getUpvotes() + 1);
                commenter.setTotalPoints(commenter.getTotalPoints() + 1);
            } else {
                comment.getDownvotedUserIds().add(voter.getId());
                comment.setDownvotes(comment.getDownvotedUserIds().size());
                commenter.setDownvotes(commenter.getDownvotes() + 1);
                commenter.setTotalPoints(commenter.getTotalPoints() - 1);
            }
            userRepository.save(commenter);
            commentRepository.save(comment);
        }
        postRepository.save(post);
        return post;
    }

    public void handleResolution(Long postId, Long commentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.getResolutionCommentId() == null) {
            post.setResolutionCommentId(commentId);
            post.setStatus(PostStatus.RESOLVED);
            postRepository.save(post);
        }
    }

    public List<MiniPostDTO> searchPosts(String color, String shape, String material, String wikidataLabelTitle) {
        color = StringUtil.formatSearchParameters(color);
        shape = StringUtil.formatSearchParameters(shape);
        material = StringUtil.formatSearchParameters(material);

        List<Post> posts = postRepository.searchByAllFields(color, shape, material, wikidataLabelTitle);
        return posts.stream()
                .map(post -> {
                    MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
                    return postMapper.toMiniPostDTO(post, miniProfile);
                })
                .collect(Collectors.toList());
    }
}
