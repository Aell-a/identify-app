package com.example.identify.mapper;

import com.example.identify.dto.post.MiniPostDTO;
import com.example.identify.dto.post.PostDTO;
import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.Media;
import com.example.identify.model.Post;
import com.example.identify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {
    @Autowired
    private UserService userService;

    public PostDTO toPostDTO(Post post) {
            MiniProfile miniProfile = userService.getMiniProfile(post.getUserId());
            return PostDTO.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .description(post.getDescription())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .numberOfComments(post.getNumberOfComments())
                    .upvotes(post.getUpvotes())
                    .downvotes(post.getDownvote())
                    .totalPoints(post.getTotalPoints())
                    .tags(post.getTags())
                    .user(miniProfile)
                    .imageUrls(post.getMystery().getMedias().stream().map(Media::getMediaUrl).toList())
                    .weight(post.getMystery().getWeight())
                    .sizeX(post.getMystery().getSizeX())
                    .sizeY(post.getMystery().getSizeY())
                    .sizeZ(post.getMystery().getSizeZ())
                    .colors(post.getMystery().getColors())
                    .materials(post.getMystery().getMaterials())
                    .shapes(post.getMystery().getShapes())
                    .wikidataLabels(post.getMystery().getWikidataLabels())
                    .build();
    }

    public MiniPostDTO toMiniPostDTO(Post post) {
        return MiniPostDTO.builder()
                .id(post.getId())
                .user(userService.getMiniProfile(post.getUserId()))
                .title(post.getTitle())
                .description(post.getDescription())
                .totalPoints(post.getTotalPoints())
                .tags(post.getTags())
                .imageUrl(post.getMystery().getMedias().get(0).getMediaUrl())
                .build();
    }

//    public Post toPost(PostRequest postRequest) {
//
//    }
}