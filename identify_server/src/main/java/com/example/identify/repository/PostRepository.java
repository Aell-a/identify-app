package com.example.identify.repository;

import com.example.identify.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTitleContaining(String title);
    List<Post> findAllByUserId(Long userId);
    @Query ("SELECT p FROM Post p JOIN p.tags t WHERE t.id = :tagId")
    List<Post> findAllByTagId(@Param("tagId") Long tagId);
    @Query("SELECT p FROM Post p WHERE p.userId = :userId ORDER BY p.createdAt DESC")
    List<Post> findRecentPostsByUserId(@Param("userId") Long userId);
    @Query("SELECT p FROM Post p " +
            "JOIN p.mystery m " +
            "LEFT JOIN m.wikidataLabels w " +
            "WHERE (:color IS NULL OR :color MEMBER OF m.colors) " +
            "AND (:shape IS NULL OR :shape MEMBER OF m.shapes) " +
            "AND (:material IS NULL OR :material MEMBER OF m.materials) " +
            "AND (:wikidataLabelTitle IS NULL OR w.title LIKE %:wikidataLabelTitle%)")
    List<Post> searchByAllFields(@Param("color") String color,
                                 @Param("shape") String shape,
                                 @Param("material") String material,
                                 @Param("wikidataLabelTitle") String wikidataLabelTitle);
}
