package IDentify.DTO.Post;

import IDentify.Entity.Tag;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class MiniPostDTO {
    private Long id;
    private String title;
    private String description;
    private int totalPoints;
    private Set<Tag> tags;
    private String imageUrl;
}
