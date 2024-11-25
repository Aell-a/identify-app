"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthPopup from "./components/Appwide/AuthPopup";
import PostPreview from "./components/FrontPage/PostPreview";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import PostPopup from "./components/CreatePost/PostPopup";
import { createPost, getMainPagePosts } from "@/lib/middleware";
import { debounce } from "lodash";
import LoadingIndicator from "./components/Appwide/LoadingIndicatior";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user, token } = useAuth();
  const router = useRouter();

  const loadInitialPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMainPagePosts(0);
      if (result.success) {
        setPosts(result.data);
        setPage(1);
        setHasMore(result.data.length === 5);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback(
    debounce(async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const result = await getMainPagePosts(page);
        if (result.success) {
          setPosts((prevPosts) => [...prevPosts, ...result.data]);
          setPage((prevPage) => prevPage + 1);
          setHasMore(result.data.length === 5);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Unexpected error occurred:", error);
      } finally {
        setLoading(false);
      }
    }, 200),
    [loading, hasMore, page]
  );

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading]);

  const handlePostSubmit = async (formData) => {
    setIsPostPopupOpen(false);
    try {
      const response = await createPost(formData, token);
      if (response.success && response.data.id) {
        router.push(`/post/${response.data.id}`);
      } else {
        console.error("Failed to create post:", response.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-100 text-center">
          Recent Mysteries
        </h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <PostPreview post={post} />
            </Link>
          ))}
        </div>
        <LoadingIndicator hasMore={hasMore} loading={loading} />
        {user && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setIsPostPopupOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full"
            >
              <PlusCircle size={24} />
              Add Post
            </Button>
          </div>
        )}
      </div>
      {isPostPopupOpen && (
        <PostPopup
          isOpen={isPostPopupOpen}
          onClose={() => setIsPostPopupOpen(false)}
          onSubmit={handlePostSubmit}
        />
      )}
      {isAuthPopupOpen && (
        <AuthPopup onClose={() => setIsAuthPopupOpen(false)} />
      )}
    </main>
  );
}
