"use client";

import { Suspense, useEffect, useState } from "react";
import { searchPosts } from "@/lib/middleware";
import PostPreview from "../components/FrontPage/PostPreview";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const shape = searchParams.get("shape");
  const material = searchParams.get("material");
  const wikidataLabelTitle = searchParams.get("wikidataLabelTitle");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (color || shape || material || wikidataLabelTitle) {
        const response = await searchPosts(
          color,
          shape,
          material,
          wikidataLabelTitle
        );
        if (response.success) {
          setResults(response.data);
        } else {
          console.error("Error fetching search results:", response.error);
        }
      }
      setLoading(false);
    };

    fetchResults();
  }, [color, shape, material, wikidataLabelTitle]);

  return (
    <main className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <Loader2 />
      ) : (
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <PostPreview post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <p>No results found for your search.</p>
          )}
        </div>
      )}
    </main>
  );
}
