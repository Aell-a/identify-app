"use client";

import PostDetails from "@/app/components/postDetails";
import { useState, useEffect } from "react";

export default function PostPage({ params }) {
  const [post, setPost] = useState({
    id: 1,
    title: "Mysterious Cube Found in Desert",
    description:
      "A strange metallic cube has been discovered in the Sahara Desert. Its origins and purpose remain unknown. The cube, measuring exactly 3 meters on each side, appears to be made of an unknown alloy that resists all attempts at scanning or penetration. Its surface is perfectly smooth, with no visible seams or openings. Local authorities have cordoned off the area as scientists from around the world converge to study this enigmatic object. Theories range from ancient alien technology to a highly advanced military experiment gone awry. As the world watches and waits for answers, the desert cube continues to baffle experts and fuel speculation about its true nature and purpose.",
    media: [
      { url: "https://picsum.photos/seed/cube1/600/400" },
      { url: "https://picsum.photos/seed/cube2/600/400" },
      { url: "https://picsum.photos/seed/cube3/600/400" },
    ],
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-16T14:45:00Z",
    status: "UNSOLVED",
    upvotes: 3562,
    downvotes: 124,
    totalPoints: 3438,
    commentCount: 289,
    tags: ["Mystery", "Artifact", "Desert", "Alien", "Technology"],
    object: {
      size: { x: 3, y: 3, z: 3 },
      weight: 5000,
      colors: ["Silver", "Metallic Gray"],
      shapes: ["Cube"],
      materials: ["Unknown Alloy"],
      labels: ["Mysterious", "Alien", "Technology", "Desert", "Artifact"],
    },
    user: {
      nickname: "DesertExplorer",
      profilePicture: "https://picsum.photos/seed/user1/100",
      totalPoints: 5430,
    },
  });

  useEffect(() => {
    // Simulating API call
    console.log(`Fetching post with id: ${params.id}`);
  }, [params.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PostDetails post={post} />
    </div>
  );
}
