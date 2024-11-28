"use client";

import { useState, useEffect, useCallback } from "react";
import PostDetails from "@/app/components/Post/PostDetails";
import CommentSection from "@/app/components/Post/CommentSection";
import { getPost, getComments } from "@/lib/middleware";

export default function PostPage({ params }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPost = useCallback(async (id) => {
    try {
      const response = await getPost(id);
      console.log(response);
      if (response.success) {
        setPost(response.data);
        setIsLoaded(true);
        console.log(post);
      }
    } catch (error) {
      console.error("Error while loading post:", error);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      if (post) {
        const postId = post.id;
        const response = await getComments(postId);
        if (response.success) {
          setComments(response.data);
        }
      }
    } catch (error) {
      console.error("Error while loading comments:", error);
    }
  }, []);

  useEffect(() => {
    fetchPost(params.id);
    fetchComments(params.id);
  }, [fetchPost, fetchComments, params.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex gap-8">
        <div>{isLoaded && <PostDetails post={post} />}</div>
        <div className="lg:w-full">
          <CommentSection postId={params.id} comments={comments} />
        </div>
      </div>
    </div>
  );
}

//<
