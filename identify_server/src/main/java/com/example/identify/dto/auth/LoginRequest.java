package com.example.identify.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;
    private String password;
}
