package com.example.identify.repository;

import com.example.identify.model.WikidataLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WikidataLabelRepository extends JpaRepository<WikidataLabel, String> {
}
