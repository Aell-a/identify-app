package com.example.identify.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "\"user\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @Column(unique = true, nullable = false)
    private String nickname; // Unique nickname for the user

    @Column(unique = true, nullable = false)
    private String email; // Unique email address

    @Column(nullable = false)
    private boolean isMailVisible = false; // Default is false

    @Column(nullable = false)
    private String password; // Hashed password

    @Column(nullable = false)
    private String profilePicture = ""; // URL or path to the profile picture

    @Column(nullable = false)
    private String bio = ""; // Short bio or description of the user

    @Column(nullable = false)
    private LocalDateTime accountCreated = LocalDateTime.now(); // Timestamp for account creation date

    @Column(nullable = false)
    private LocalDateTime lastActivity = LocalDateTime.now(); // Timestamp for the last activity

    @ManyToMany
    @JoinTable(
            name = "user_followed_tags",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> followedTags = new HashSet<>();

    @ElementCollection
    private List<Long> interests = new ArrayList<>(); // Tag IDs for interests

    @ElementCollection
    private List<Long> badges = new ArrayList<>(); // Badge IDs

    @ElementCollection
    private List<Long> reports = new ArrayList<>(); // Complaint IDs

    @ElementCollection
    private List<Long> suspensions = new ArrayList<>(); // Suspension IDs

    @Column(nullable = false)
    private int totalPoint = 0; // Total points accumulated

    @Column(nullable = false)
    private int upvote = 0; // Total upvote received

    @Column(nullable = false)
    private int downvote = 0; // Total downvote received

    @Column(nullable = false)
    private boolean isDeleted = false;

    public User(String nickname, String email, String password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }
}