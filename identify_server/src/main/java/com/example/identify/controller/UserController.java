package com.example.identify.controller;

import com.example.identify.config.JwtUtil;
import com.example.identify.dto.auth.AuthResponse;
import com.example.identify.dto.auth.LoginRequest;
import com.example.identify.dto.auth.RegisterRequest;
import com.example.identify.dto.user.Profile;
import com.example.identify.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    // Login user with email/nickname and password
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.login(loginRequest);
        if (authResponse.isSuccess()) {
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authResponse);
        }
    }

    // Verify JWT token of user
    @GetMapping("/verify")
    public ResponseEntity<AuthResponse> verifyToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.getUserIdFromToken(token);
            String nickname = userService.getNicknameById(userId);
            if (userService.checkUser(userId)) {
                return ResponseEntity.ok(new AuthResponse(true, token, userId, nickname));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, "Invalid or expired token"));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, "Invalid or expired token"));
    }

    // Get user by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<Profile> getUserById(@PathVariable Long id) {
        Profile profile = userService.getProfile(id);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Check if email is unique
    @GetMapping("/checkByEmail")
    public ResponseEntity<String> checkByEmail(@RequestParam String email) {
        if (userService.isEmailInUse(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use.");
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email is unique");
        }
    }

    // Check if nickname is unique
    @GetMapping("/checkByNickname")
    public ResponseEntity<String> checkByNickname(@RequestParam String nickname) {
        if (userService.isNicknameInUse(nickname)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nickname is already in use.");
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Nickname is unique");
        }
    }

    // Create a new user (registration)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = userService.register(registerRequest);
        if (authResponse.isSuccess()) {
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(authResponse);
        }
    }

    // Update user by ID
    @PutMapping(value = "/profile/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Profile> updateUser(
            @RequestPart(value = "profile") String profileJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            Profile updatedProfile = objectMapper.readValue(profileJson, Profile.class);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = (Long) authentication.getPrincipal();

            if (profilePicture != null && !profilePicture.isEmpty()) {
                userService.updateProfilePicture(userId, profilePicture);
            }

            Profile updatedUser = userService.updateProfile(userId, updatedProfile);
            return updatedUser != null ? ResponseEntity.ok(updatedUser)
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}