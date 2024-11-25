package com.example.identify.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiniProfile {
    private Long id; // User ID
    private String nickname; // User's nickname
    private String profilePicture; // URL or path to the user's profile picture
    private int totalPoints; // Total points accumulated by the user
}