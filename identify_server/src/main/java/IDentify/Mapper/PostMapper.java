package IDentify.Mapper;

import IDentify.DTO.Post.MiniPostDTO;
import IDentify.DTO.Post.PostDTO;
import IDentify.DTO.User.MiniProfile;
import IDentify.Entity.Post;
import IDentify.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PostMapper {
    @Autowired
    private UserService userService;

    public PostDTO toPostDTO(Post post) {
        Optional<MiniProfile> optionalMiniProfile = userService.getMiniProfile(post.getUserId());
        if (optionalMiniProfile.isPresent()) {
            MiniProfile miniProfile = optionalMiniProfile.get();
            return PostDTO.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .description(post.getDescription())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .numberOfComments(post.getNumberOfComments())
                    .upvotes(post.getUpvotes())
                    .downvotes(post.getDownvote())
                    .totalPoints(post.getTotalPoints())
                    .tags(post.getTags())
                    .user(miniProfile)
                    .build();
        } else {
            return null;
        }

    }

    public MiniPostDTO toMiniPostDTO(Post post) {
        return MiniPostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .totalPoints(post.getTotalPoints())
                .tags(post.getTags())
                .imageUrl(post.getMystery().getMedias().get(0).getMediaUrl())
                .build();
    }
}
