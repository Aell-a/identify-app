package com.example.identify.repository;

import com.example.identify.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
    List<Comment> findRecentCommentsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.id = :commentId")
    Comment findByPostAndCommentId(@Param("postId") Long postId, @Param("commentId") Long commentId);
}
