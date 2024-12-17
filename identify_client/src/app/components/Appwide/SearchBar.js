"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const parseQuery = (input) => {
    const params = {
      color: null,
      shape: null,
      material: null,
      wikidataLabelTitle: null,
    };
    input.split(" ").forEach((criterion) => {
      const [key, value] = criterion.split(":");
      if (criterion.startsWith("wiki:")) {
        params.wikidataLabelTitle = criterion.replace("wiki:", "").trim();
      } else if (key && value)
        params[key.trim().toLowerCase()] = value.trim().toLowerCase();
    });
    return params;
  };

  const handleSearch = async () => {
    if (!query) return;
    const params = parseQuery(query);
    const queryString = new URLSearchParams(params).toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl justify-center py-4 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full md:w-3/4 lg:w-1/2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, hover for instructions"
              className="bg-gray-700 text-gray-100 border-none w-full h-12 text-base"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-lg">Use format:</p>
            <p>color:grey material:glass shape:pyramid</p>
            <p>For searching in wikidata labels use wiki:example</p>
            <p>Combine multiple criteria with spaces.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        type="button"
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 mt-2 h-12 text-lg"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
      </Button>
    </div>
  );
}
