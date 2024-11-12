package IDentify.DTO.Post;

import IDentify.DTO.User.MiniProfile;
import IDentify.Entity.PostStatus;
import IDentify.Entity.Tag;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PostStatus status;
    private int numberOfComments;
    private int upvotes;
    private int downvotes;
    private int totalPoints;
    private Set<Tag> tags;
    private MiniProfile user;
}
