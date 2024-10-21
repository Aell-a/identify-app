package com.example.demo;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primary key

    @Column(unique = true, nullable = false)
    private String nickname;  // Unique nickname for the user

    @Column(unique = true, nullable = false)
    private String email;  // Unique email address

    @Column(nullable = false)
    private boolean isMailVisible = false;  // Default is false

    @Column(nullable = false)
    private String password;  // Hashed password

    private String profilePicture = "";  // URL or path to the profile picture

    private String bio = "";  // Short bio or description of the user

    @Column(nullable = false)
    private LocalDateTime accountCreated = LocalDateTime.now(); // Timestamp for account creation date

    private LocalDateTime lastActivity = LocalDateTime.now();  // Timestamp for the last activity

    @ElementCollection
    private List<Long> followedTags = new ArrayList<>();  // Tag IDs for followed tags

    @ElementCollection
    private List<Long> interests= new ArrayList<>();  // Tag IDs for interests

    @ElementCollection
    private List<Long> badges= new ArrayList<>();  // Badge IDs

    @ElementCollection
    private List<Long> reports= new ArrayList<>();  // Complaint IDs

    @ElementCollection
    private List<Long> suspensions= new ArrayList<>();  // Suspension IDs

    private int totalPoint = 0;  // Total points accumulated

    private int upvote = 0;  // Total upvotes received

    private int downvote = 0;  // Total downvotes received

    private boolean isDeleted = false;  // Soft delete flag

    public User(String nickname, String email, String password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    public User() {

    }

    // TODO: Add getters and setters based on what information will be requested from front-end side.
}