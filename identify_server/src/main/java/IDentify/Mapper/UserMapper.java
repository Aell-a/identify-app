package IDentify.Mapper;

import IDentify.DTO.User.MiniProfile;
import IDentify.DTO.User.Profile;
import IDentify.DTO.Auth.AuthResponse;
import IDentify.Entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public MiniProfile toMiniProfile(User user) {
        if (user == null) {
            return null;
        }
        return MiniProfile.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .profilePicture(user.getProfilePicture())
                .totalPoints(user.getTotalPoint())
                .build();
    }

    public Profile toProfile(User user) {
        if (user == null) {
            return null;
        }
        return Profile.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.isMailVisible() ? user.getEmail() : null)
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .totalPoints(user.getTotalPoint())
                .accountCreated(user.getAccountCreated())
                .lastActivity(user.getLastActivity())
                .build();
    }

}