package com.example.identify.mapper;

import com.example.identify.dto.post.CommentDTO;
import com.example.identify.dto.post.MiniPostDTO;
import com.example.identify.dto.post.PostDTO;
import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.Media;
import com.example.identify.model.Post;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PostMapper {
    public PostDTO toPostDTO(Post post, MiniProfile user, List<CommentDTO> comments) {
            return PostDTO.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .description(post.getDescription())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .numberOfComments(post.getNumberOfComments())
                    .upvotes(post.getUpvotes())
                    .upvotedUserIds(post.getUpvotedUserIds())
                    .downvotes(post.getDownvotes())
                    .downvotedUserIds(post.getDownvotedUserIds())
                    .totalPoints(post.getUpvotes() - post.getDownvotes())
                    .tags(post.getTags())
                    .user(user)
                    .imageUrls(post.getMystery().getMedias().stream().map(Media::getMediaUrl).toList())
                    .weight(post.getMystery().getWeight())
                    .sizeX(post.getMystery().getSizeX())
                    .sizeY(post.getMystery().getSizeY())
                    .sizeZ(post.getMystery().getSizeZ())
                    .colors(post.getMystery().getColors())
                    .materials(post.getMystery().getMaterials())
                    .shapes(post.getMystery().getShapes())
                    .wikidataLabels(post.getMystery().getWikidataLabels())
                    .comments(comments)
                    .build();
    }

    public MiniPostDTO toMiniPostDTO(Post post, MiniProfile user) {
        return MiniPostDTO.builder()
                .id(post.getId())
                .user(user)
                .title(post.getTitle())
                .description(post.getDescription())
                .upvotedUserIds(post.getUpvotedUserIds())
                .numberOfComments(post.getNumberOfComments())
                .totalPoints(post.getUpvotes() - post.getDownvotes())
                .tags(post.getTags())
                .imageUrl(post.getMystery().getMedias().get(0).getMediaUrl())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
