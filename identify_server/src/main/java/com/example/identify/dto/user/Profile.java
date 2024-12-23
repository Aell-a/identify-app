package com.example.identify.dto.user;

import com.example.identify.dto.post.CommentDTO;
import com.example.identify.dto.post.MiniPostDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Profile {
    private Long id;
    private String nickname;
    private String email;
    private String profilePicture;
    private String bio; 
    private LocalDateTime accountCreated;
    private LocalDateTime lastActivity;
    private int totalPoints;
    private int upvotes;
    private int downvotes;
    private List<Long> followedTags;
    private List<Long> badges;
    private List<MiniPostDTO> recentPosts;
    private List<CommentDTO> recentComments;
}
