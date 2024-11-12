"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthPopup from "./components/authPopup";
import PostPreview from "./components/postPreview";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import PostPopup from "./components/createPost/postPopup";

export default function Home() {
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Mysterious Cube Found in Desert",
      description:
        "A strange metallic cube has been discovered in the Sahara Desert. Its origins and purpose remain unknown...",
      media: [{ url: "https://picsum.photos/seed/cube/600/400" }],
      totalPoints: 1205,
      commentCount: 89,
      tags: ["Mystery", "Artifact"],
      user: {
        nickname: "DesertExplorer",
        profilePicture: "https://picsum.photos/seed/user1/100",
        totalPoints: 5430,
      },
    },
    {
      id: 2,
      title: "Underwater Anomaly Detected",
      description:
        "Sonar scans have revealed an unusual structure deep in the Pacific Ocean. Marine biologists are baffled...",
      media: [{ url: "https://picsum.photos/seed/underwater/600/400" }],
      totalPoints: 876,
      commentCount: 62,
      tags: ["Ocean", "Unexplained"],
      user: {
        nickname: "OceanicWonder",
        profilePicture: "https://picsum.photos/seed/user2/100",
        totalPoints: 3210,
      },
    },
    {
      id: 3,
      title: "Ancient Artifact Emits Strange Energy",
      description:
        "An artifact recovered from an archaeological dig site is exhibiting unexplained energy readings...",
      media: [{ url: "https://picsum.photos/seed/artifact/600/400" }],
      totalPoints: 1543,
      commentCount: 127,
      tags: ["Archaeology", "Energy"],
      user: {
        nickname: "HistoryHunter",
        profilePicture: "https://picsum.photos/seed/user3/100",
        totalPoints: 7890,
      },
    },
  ]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleLoadMore = () => {
    setLoading(true);
    // API CALL
    setTimeout(() => {
      const newPosts = [
        {
          id: 4,
          title: "Unidentified Flying Object Sighted",
          description:
            "Multiple witnesses report seeing a disc-shaped object hovering silently over a rural town...",
          media: [{ url: "https://picsum.photos/seed/ufo/600/400.jpg" }],
          totalPoints: 2101,
          commentCount: 203,
          tags: ["UFO", "Sighting"],
          user: {
            nickname: "SkyWatcher",
            profilePicture: "https://picsum.photos/seed/user4/100.jpg",
            totalPoints: 6540,
          },
        },
        {
          id: 5,
          title: "Crop Circle Forms in Minutes",
          description:
            "Time-lapse footage captures the formation of an intricate crop circle in a matter of minutes...",
          media: [{ url: "https://picsum.photos/seed/crop/600/400.jpg" }],
          totalPoints: 987,
          commentCount: 75,
          tags: ["Crop Circles", "Paranormal"],
          user: {
            nickname: "FieldResearcher",
            profilePicture: "https://picsum.photos/seed/user5/100.jpg",
            totalPoints: 4320,
          },
        },
      ];
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLoading(false);
    }, 1000);
  };

  const handlePostSubmit = (postData) => {
    // Handle the submission of new post data
    console.log("New post data submitted:", postData);
    setIsPostPopupOpen(false);
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
        <div className="mt-8 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
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
