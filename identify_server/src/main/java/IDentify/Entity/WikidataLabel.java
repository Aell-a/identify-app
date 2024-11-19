package IDentify.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@Table(name = "wikidata_labels")
@Data
@NoArgsConstructor
public class WikidataLabel {

    @Id
    private String wikidataId;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "wikidata_related_labels",
            joinColumns = @JoinColumn(name = "wikidata_id")
    )
    @Column(name = "related_label")
    private List<String> relatedLabels;
}
