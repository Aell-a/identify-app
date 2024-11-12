package IDentify.DTO.Post;

import IDentify.DTO.Media.MediaRequest;
import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private Long userId;
    private String title;
    private String description;
    private List<MediaRequest> mediaRequests; // List to support multiple media items
    private List<LabelRequest> labelRequests;
    private List<String> colors;
    private List<String> shapes;
    private List<String> materials;
    private double weight;
    private double sizeX;
    private double sizeY;
    private double sizeZ;
    private List<String> tags;
}