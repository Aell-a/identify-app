package com.example.identify;

import com.example.identify.controller.UserController;
import com.example.identify.dto.auth.AuthResponse;
import com.example.identify.dto.auth.LoginRequest;
import com.example.identify.dto.auth.RegisterRequest;
import com.example.identify.dto.user.Profile;
import com.example.identify.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setIdentifier("test@example.com");
        loginRequest.setPassword("password");

        AuthResponse authResponse = new AuthResponse(true, "token", 1L, "testUser");
        when(userService.login(any(LoginRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = userController.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
    }

    @Test
    void testLoginFailure() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setIdentifier("test@example.com");
        loginRequest.setPassword("wrongPassword");

        AuthResponse authResponse = new AuthResponse(false, "Wrong password");
        when(userService.login(any(LoginRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = userController.login(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
    }

    @Test
    void testGetUserByIdSuccess() {
        Profile profile = new Profile();
        profile.setId(1L);
        when(userService.getProfile(1L)).thenReturn(profile);

        ResponseEntity<Profile> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(profile, response.getBody());
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userService.getProfile(1L)).thenReturn(null);

        ResponseEntity<Profile> response = userController.getUserById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testRegisterUserSuccess() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setNickname("newUser");
        registerRequest.setEmail("new@example.com");
        registerRequest.setPassword("password");

        AuthResponse authResponse = new AuthResponse(true, "token", 1L, "newUser");
        when(userService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = userController.registerUser(registerRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
    }

    @Test
    void testRegisterUserConflict() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setNickname("existingUser");
        registerRequest.setEmail("existing@example.com");
        registerRequest.setPassword("password");

        AuthResponse authResponse = new AuthResponse(false, "User already exists");
        when(userService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = userController.registerUser(registerRequest);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
    }
}