package IDentify.DTO.Media;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MediaRequest {
    private String description;
    private MultipartFile file; // Actual media file data if handling upload directly
}