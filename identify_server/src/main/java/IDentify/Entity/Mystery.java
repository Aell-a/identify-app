package IDentify.Entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
public class Mystery {
    // Common fields in every user posted object
    private String weight;
    // Holding object dimensions as x,y,z
    private double sizeX;
    private double sizeY;
    private double sizeZ;
    @ElementCollection
    private List<String> colors;
    @ElementCollection
    private List<String> shapes;
    @ElementCollection
    private List<String> materials;

    // User should add at minimum one media file
    @NonNull
    @ElementCollection
    private List<Media> medias;

    // List of user added wikidata labels
    @ElementCollection
    private List<WikidataLabel> wikidataLabels;
}
