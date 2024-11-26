import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

function LabelHolder({ index, title, description, wikidataId }) {
  return (
    <TooltipProvider>
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <Link
            href={"https://www.wikidata.org/wiki/" + wikidataId}
            target="_blank"
          >
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm cursor-pointer">
              {title}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LabelHolder;
