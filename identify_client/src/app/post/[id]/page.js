"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PostDetails from "@/app/components/Post/PostDetails";
import CommentSection from "@/app/components/Post/CommentSection";
import { getPost } from "@/lib/middleware";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div>{isLoaded && <PostDetails post={post} />}</div>
        <div>
          <CommentSection postId={params.id} loadedComments={comments} />
        </div>
      </div>
    </div>
  );
}
