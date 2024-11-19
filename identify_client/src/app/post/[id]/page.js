"use client";

import PostDetails from "@/app/components/postDetails";
import { getPost } from "@/lib/middleware";
import { useState, useEffect, useCallback } from "react";

export default function PostPage({ params }) {
  const [post, setPost] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPost = useCallback(async (id) => {
    console.log(id);
    try {
      const response = await getPost(id);
      console.log(response);
      if (response.success) {
        setPost(response.data);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error while loading post:", error);
    }
  }, []);

  useEffect(() => {
    console.log(`Fetching post with id: ${params.id}`);
    fetchPost(params.id);
  }, [fetchPost, params.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoaded && <PostDetails post={post} />}
    </div>
  );
}
