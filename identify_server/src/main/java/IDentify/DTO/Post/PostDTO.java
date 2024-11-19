package IDentify.DTO.Post;

import IDentify.DTO.User.MiniProfile;
import IDentify.Entity.PostStatus;
import IDentify.Entity.Tag;
import IDentify.Entity.WikidataLabel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
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
    private List<String> imageUrls;
    private String weight;
    private double sizeX;
    private double sizeY;
    private double sizeZ;
    private List<String> colors;
    private List<String> shapes;
    private List<String> materials;
    private List<WikidataLabel> wikidataLabels;
}
