package IDentify.Controller;

import IDentify.Config.JwtUtil;
import IDentify.DTO.Auth.AuthResponse;
import IDentify.DTO.Auth.LoginRequest;
import IDentify.DTO.Auth.RegisterRequest;
import IDentify.DTO.User.Profile;
import IDentify.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

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

            if (userService.checkUser(userId)) {
                return ResponseEntity.ok(new AuthResponse(true, token , userId));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, "Invalid or expired token"));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, "Invalid or expired token"));
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getUserById(@PathVariable Long id) {
        return userService.getProfile(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
//    @PutMapping("/{id}")
//    public ResponseEntity<Profile> updateUser(@PathVariable Long id, @RequestBody Profile updatedProfile) {
//        Optional<Profile> updatedUser = userService.updateProfile(id, updatedProfile);
//        return updatedUser
//                .map(user -> ResponseEntity.ok(user))
//                .orElse(ResponseEntity.notFound().build());
//    }
}