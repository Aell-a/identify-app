"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PostDetails from "@/app/components/Post/PostDetails";
import CommentSection from "@/app/components/Post/CommentSection";
import { getPost, markResolution } from "@/lib/middleware";
import { useAuth } from "@/lib/auth";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { token } = useAuth();

  const fetchPost = useCallback(async (id) => {
    try {
      const response = await getPost(id);
      if (response.success) {
        setPost(response.data);
        setComments(response.data.comments);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error while loading post:", error);
    }
  }, []);

  useEffect(() => {
    fetchPost(params.id);
  }, [fetchPost, params.id]);

  const handleMarkAsResolution = async (commentId) => {
    try {
      const response = await markResolution(post.id, commentId, token);
      if (response.success) {
        setPost((prevPost) => ({
          ...prevPost,
          status: "RESOLVED",
          resolutionCommentId: commentId,
        }));
      }
    } catch (error) {
      console.error("Error marking comment as resolution:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div>{isLoaded && <PostDetails post={post} />}</div>
        <div>
          <CommentSection
            postId={params.id}
            postOwner={isLoaded ? post.user.id : ""}
            loadedComments={comments}
            onMarkAsResolution={handleMarkAsResolution}
            resolutionId={isLoaded ? post.resolutionCommentId : ""}
          />
        </div>
      </div>
    </div>
  );
}
