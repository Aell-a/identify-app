package IDentify.Repository;

import IDentify.Entity.WikidataLabel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WikidataLabelRepository extends JpaRepository<WikidataLabel, String> {
}
