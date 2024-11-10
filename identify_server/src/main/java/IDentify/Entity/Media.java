package IDentify.Entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Embeddable
@NoArgsConstructor
@Data
public class Media {

    @NonNull
    private String mediaType; // (audio, video, image)

    @NonNull
    private String mediaUrl; // URL pointing out to uploaded data in our server

    @NonNull
    private String mediaFormat; // .png, .jpg, .mp3 etc

    private String mediaDescription; // Optional media description for accessibility features
}
