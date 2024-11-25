package com.example.identify.repository;

import com.example.identify.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTitleContaining(String title);
    List<Post> findAllByUserId(Long userId);
    @Query ("SELECT p FROM Post p JOIN p.tags t WHERE t.id = :tagId")
    List<Post> findAllByTagId(@Param("tagId") Long tagId);
}
