package com.example.identify.dto.post;

import com.example.identify.dto.user.MiniProfile;
import com.example.identify.model.PostStatus;
import com.example.identify.model.Tag;
import com.example.identify.model.WikidataLabel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PostStatus status;
    private int numberOfComments;
    private int upvotes;
    private Set<Long> upvotedUserIds;
    private int downvotes;
    private Set<Long> downvotedUserIds;
    private int totalPoints;
    private Set<Tag> tags;
    private MiniProfile user;
    private List<String> imageUrls;
    private String weight;
    private double sizeX;
    private double sizeY;
    private double sizeZ;
    private List<String> colors;
    private List<String> shapes;
    private List<String> materials;
    private List<WikidataLabel> wikidataLabels;
    private List<CommentDTO> comments;
}
