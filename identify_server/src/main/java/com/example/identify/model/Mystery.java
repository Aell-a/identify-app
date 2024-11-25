package com.example.identify.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
public class Mystery {
    private String weight;
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

    @ManyToMany
    @JoinTable(
            name = "post_wikidata_labels",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "wikidata_id")
    )
    private List<WikidataLabel> wikidataLabels;
}
