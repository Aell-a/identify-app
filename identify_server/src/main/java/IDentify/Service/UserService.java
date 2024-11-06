package IDentify.Service;

import IDentify.DTO.Auth.LoginRequest;
import IDentify.DTO.Auth.AuthResponse;
import IDentify.DTO.Auth.RegisterRequest;
import IDentify.DTO.User.MiniProfile;
import IDentify.DTO.User.Profile;
import IDentify.Entity.User;
import IDentify.Mapper.UserMapper;
import IDentify.Repository.UserRepository;
import IDentify.Config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserMapper userMapper;

    // Checks nickname uniqueness
    public boolean isNicknameInUse(String nickname) {
        return userRepository.findByNickname(nickname).isPresent();
    }

    // Checks email uniqueness
    public boolean isEmailInUse(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // Checks if user exists by id
    public boolean checkUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.isPresent();
    }

    // Logs in the user based on identifier (email/nickname) and password
    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional;

        if (loginRequest.getIdentifier().contains("@")) {
            userOptional = userRepository.findByEmail(loginRequest.getIdentifier());
        } else {
            userOptional = userRepository.findByNickname(loginRequest.getIdentifier());
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getId());
                user.setLastActivity(LocalDateTime.now());
                userRepository.save(user);
                return new AuthResponse(true ,token, user.getId(), user.getNickname());
            } else {
                return new AuthResponse(false, "Wrong password");
            }
        } else {
            return new AuthResponse(false, "Invalid credentials");
        }
    }

    // Creates new user with input credentials
    public AuthResponse register(RegisterRequest registerRequest) {
        User newUser = new User(registerRequest.getNickname(), registerRequest.getEmail(), passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(newUser);

        String token = jwtUtil.generateToken(newUser.getId());
        return new AuthResponse(true ,token, newUser.getId(), newUser.getNickname());
    }

    // Gets user nickname from id
    public String getNicknameById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(User::getNickname).orElse(null);
    }

    // Gets user profile information by id
    public Optional<Profile> getProfile(Long id) {
        return userRepository.findById(id).map(userMapper::toProfile);
    }

    // Gets user mini profile information by id
    public Optional<MiniProfile> getMiniProfile(Long id) {
        return userRepository.findById(id).map(userMapper::toMiniProfile);
    }

    // Updates user profile
    public Optional<Profile> updateProfile(Long id, Profile updatedProfile) {
        return userRepository.findById(id)
                .map(user -> {
                    User updatedUser = userMapper.toUser(user, updatedProfile);
                    updatedUser.setLastActivity(LocalDateTime.now());
                    User savedUser = userRepository.save(updatedUser);
                    return userMapper.toProfile(savedUser);
                });

    }
}

