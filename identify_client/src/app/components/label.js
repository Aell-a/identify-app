import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function LabelHolder({ index, title, description }) {
  return (
    <TooltipProvider>
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm cursor-help">
            {title}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LabelHolder;
