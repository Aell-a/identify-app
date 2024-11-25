package com.example.identify.dto.auth;

import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class AuthResponse {
    private boolean success;
    private String error;
    private String token;
    private long id;
    private String nickname;

    public AuthResponse(boolean success, String token, Long userId, String nickname) {
        this.success = success;
        this.token = token;
        this.id = userId;
        this.nickname = nickname;
        this.error = null;
    }

    public AuthResponse(boolean success, String error) {
        this.success = success;
        this.error = error;
        this.token = null;
        this.id = 0;
        this.nickname = null;
    }
}