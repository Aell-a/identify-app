package IDentify.Entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
public class WikidataLabel {

    @NonNull
    private String wikidataId;

    @NonNull
    private String title;

    @NonNull
    private String description;

    private List<String> relatedLabels;
}
