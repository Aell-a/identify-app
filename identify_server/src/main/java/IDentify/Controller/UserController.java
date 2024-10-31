package IDentify.Controller;

import IDentify.Config.JwtUtil;
import IDentify.Entity.User;
import IDentify.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Login user from email or nickname and password
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
        String identifier = loginRequest.get("identifier"); // This will be either email or nickname
        String password = loginRequest.get("password");

        Optional<User> userOptional;

        // Check if the identifier is an email or a nickname
        if (identifier.contains("@")) { // Simple check for email format
            userOptional = userRepository.findByEmail(identifier); // Search by email
        } else {
            userOptional = userRepository.findByNickname(identifier); // Search by nickname
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getId());
                return ResponseEntity.ok(token);
            } else {
               return ResponseEntity.status(HttpStatus.CONFLICT).body("Wrong password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // Verify JWT token of user
    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " prefix

            // Get the userId from the token
            Long userId = jwtUtil.getUserIdFromToken(token);

            // Check if the token is valid
            if (userId != null && jwtUtil.isTokenValid(token, userId)) {
                // Verify if the user exists in the database
                if (userRepository.findById(userId).isPresent()) {
                    return ResponseEntity.ok("Token is valid and user exists");
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token valid but user does not exist");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }

    // Check if email is unique
    @GetMapping("/checkByEmail")
    public ResponseEntity<String> checkByEmail(@RequestParam String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use.");
        } else return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email is unique");
    }

    // Check if nickname is unique
    @GetMapping("/checkByNickname")
    public ResponseEntity<String> checkByNickname(@RequestParam String nickname) {
        if (userRepository.findByNickname(nickname).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nickname is already in use.");
        } else return ResponseEntity.status(HttpStatus.ACCEPTED).body("Nickname is unique");
    }

    // Create a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the database
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId());

        // Return the token in the response
        return ResponseEntity.ok(token);
    }

    // Update user by ID
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setNickname(updatedUser.getNickname());
                    user.setEmail(updatedUser.getEmail());
                    user.setProfilePicture(updatedUser.getProfilePicture());
                    user.setBio(updatedUser.getBio());
                    user.setMailVisible(updatedUser.isMailVisible());
                    // Add any other fields you want to update
                    User savedUser = userRepository.save(user);
                    return ResponseEntity.ok(savedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}