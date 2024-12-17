import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function WikidataSearch({ selectedLabels, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = "https://www.wikidata.org/w/api.php";

  const searchWikidata = async (query) => {
    try {
      const searchResponse = await axios.get(endpoint, {
        params: {
          action: "wbsearchentities",
          format: "json",
          language: "en",
          type: "item",
          continue: "0",
          limit: "10",
          search: query,
          origin: "*",
        },
      });
      return searchResponse.data.search.map((item) => ({
        wikidataId: item.id,
        title: item.label,
        description: item.description || "",
      }));
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const searchResults = await searchWikidata(query);
    setResults(searchResults);
    setIsLoading(false);
  };

  const getDetailedData = async (id) => {
    try {
      const detailedData = await axios.get(endpoint, {
        params: {
          action: "wbgetentities",
          format: "json",
          ids: id,
          props: "claims",
          origin: "*",
        },
      });
      let relatedLabels = [];
      const entity = detailedData.data.entities[id];
      if (entity.claims.P31) {
        relatedLabels = [
          ...entity.claims.P31.map(
            (claim) => claim.mainsnak.datavalue.value.id
          ),
        ];
      }
      if (entity.claims.P279) {
        relatedLabels = [
          ...relatedLabels,
          ...entity.claims.P279.map(
            (claim) => claim.mainsnak.datavalue.value.id
          ),
        ];
      }
      if (entity.claims.P361) {
        relatedLabels = [
          ...relatedLabels,
          ...entity.claims.P361.map(
            (claim) => claim.mainsnak.datavalue.value.id
          ),
        ];
      }

      return relatedLabels;
    } catch (error) {
      console.error("Error while querying Wikidata:", error);
      return [];
    }
  };

  const handleSelect = async (item) => {
    const relatedLabels = await getDetailedData(item.wikidataId);
    const selectedItem = {
      ...item,
      relatedLabels,
    };
    const updatedLabels = [...selectedLabels, selectedItem];
    onChange(updatedLabels);
    setResults([]);
    setQuery("");
  };

  const handleRemove = (wikidataId) => {
    const updatedLabels = selectedLabels.filter(
      (label) => label.wikidataId !== wikidataId
    );
    onChange(updatedLabels);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Wikidata for labels."
          className="bg-gray-700 text-gray-100 border-none"
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="relative">
        {isLoading ? (
          <div className="space-y-2 bg-gray-700 p-2 rounded max-h-60 overflow-y-auto">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-2 rounded">
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          results.length > 0 && (
            <ul className="space-y-2 bg-gray-700 p-2 rounded max-h-60 overflow-y-auto absolute w-full z-10">
              {results.map((item) => (
                <li
                  key={item.wikidataId}
                  className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                  onClick={() => handleSelect(item)}
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-400">
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      {selectedLabels.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Selected Labels:</h4>
          <ul className="space-y-2">
            {selectedLabels.map((label) => (
              <li
                key={label.wikidataId}
                className="flex items-center justify-between bg-gray-700 p-2 rounded"
              >
                <div>
                  <div className="font-semibold">{label.title}</div>
                  <div className="text-sm text-gray-400">
                    {label.description}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(label.wikidataId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
