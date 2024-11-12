import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// This is a mock function. Replace it with actual Wikidata API call
const searchWikidata = async (query) => {
  // Simulating API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      wikidataId: "Q1",
      title: "Universe",
      description: "All of space and time and their contents",
    },
    {
      wikidataId: "Q2",
      title: "Earth",
      description: "Third planet from the Sun in the Solar System",
    },
    {
      wikidataId: "Q3",
      title: "Life",
      description:
        "Condition that distinguishes animals and plants from inorganic matter",
    },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
};

export default function WikidataSearch({ selectedLabels, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const searchResults = await searchWikidata(query);
    setResults(searchResults);
  };

  const handleSelect = (item) => {
    const updatedLabels = [...selectedLabels, item];
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
          placeholder="Search Wikidata..."
          className="bg-gray-700 text-gray-100"
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {results.length > 0 && (
        <ul className="space-y-2 bg-gray-700 p-2 rounded">
          {results.map((item) => (
            <li
              key={item.wikidataId}
              className="cursor-pointer hover:bg-gray-600 p-2 rounded"
              onClick={() => handleSelect(item)}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-400">{item.description}</div>
            </li>
          ))}
        </ul>
      )}
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
