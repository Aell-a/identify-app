package com.example.identify.dto.post;

import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.Tag;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class MiniPostDTO {
    private Long id;
    private MiniProfile user;
    private String title;
    private String description;
    private Set<Long> upvotedUserIds;
    private int totalPoints;
    private Set<Tag> tags;
    private String imageUrl;
    private int numberOfComments;
    private Long resolutionCommentId;
    private LocalDateTime createdAt;
}
