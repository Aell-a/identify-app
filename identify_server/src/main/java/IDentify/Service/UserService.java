package IDentify.Service;

import IDentify.DTO.Auth.LoginRequest;
import IDentify.DTO.Auth.AuthResponse;
import IDentify.DTO.Auth.RegisterRequest;
import IDentify.DTO.User.MiniProfile;
import IDentify.DTO.User.Profile;
import IDentify.Entity.Media;
import IDentify.Entity.User;
import IDentify.Mapper.UserMapper;
import IDentify.Repository.UserRepository;
import IDentify.Config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    @Autowired
    private MediaService mediaService;

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
    public Profile getProfile(Long id) {

        Optional<User> user = userRepository.findById(id);
        return user.map(userMapper::toProfile).orElse(null);
    }

    // Gets user mini profile information by id
    public MiniProfile getMiniProfile(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(userMapper::toMiniProfile).orElse(null);
    }

    // Updates user profile
    public Profile updateProfile(Long id, Profile updatedProfile) {
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            user.setBio(updatedProfile.getBio());
            userRepository.save(user);
            return userMapper.toProfile(user);
        }
        return null;
    }

    public void updateProfilePicture(Long id, MultipartFile profilePicture) throws IOException {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                Media profileMedia = mediaService.uploadMedia(profilePicture, id);
                user.setProfilePicture(profileMedia.getMediaUrl());
            }

            userRepository.save(user);
        }
    }
}

