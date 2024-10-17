package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime accountCreationDate;

    @Column()
    private boolean isMailVisible;

    @Column()
    private String profilePictureURI;

    @Column()
    private String bio;

    @Column()
    private LocalDateTime lastActivityDate;


}