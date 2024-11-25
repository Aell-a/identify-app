package com.example.identify.dto.user;

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
    private int upvote;
    private int downvote;
    private List<Long> followedTags;
    private List<Long> badges;
}
