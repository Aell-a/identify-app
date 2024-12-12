package com.example.identify.mapper;

import com.example.identify.dto.post.CommentDTO;
import com.example.identify.dto.post.MiniPostDTO;
import com.example.identify.dto.user.MiniProfile;
import com.example.identify.dto.user.Profile;
import com.example.identify.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

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
                .totalPoints(user.getTotalPoints())
                .createdAt(user.getAccountCreated())
                .build();
    }

    public Profile toProfile(User user, List<MiniPostDTO> recentPosts, List<CommentDTO> recentComments) {
        if (user == null) {
            return null;
        }
        return Profile.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.isMailVisible() ? user.getEmail() : null)
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .upvotes(user.getUpvotes())
                .downvotes(user.getDownvotes())
                .totalPoints(user.getTotalPoints())
                .accountCreated(user.getAccountCreated())
                .lastActivity(user.getLastActivity())
                .recentPosts(recentPosts)
                .recentComments(recentComments)
                .build();
    }

    public User toUser(User user, Profile updatedProfile) {
        user.setBio(updatedProfile.getBio());
        user.setProfilePicture(updatedProfile.getProfilePicture());

        return user;
    }
}