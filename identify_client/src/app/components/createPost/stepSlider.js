import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const weightRanges = [
  { value: 0, label: "<50g" },
  { value: 1, label: "50-100g" },
  { value: 2, label: "100-250g" },
  { value: 3, label: "250-500g" },
  { value: 4, label: "500-750g" },
  { value: 5, label: "750g-1kg" },
  { value: 6, label: "1-2kg" },
  { value: 7, label: "2-5kg" },
  { value: 8, label: ">5kg" },
];

export default function StepSlider({ value, onChange }) {
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleLabelClick = (index) => {
    onChange(index);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 -translate-y-1/2"></div>
        <div
          className="absolute left-0 top-1/2 h-1 bg-blue-500 -translate-y-1/2 transition-all"
          style={{ width: `${(value / (weightRanges.length - 1)) * 100}%` }}
        ></div>
        <div className="relative flex justify-between">
          {weightRanges.map((range, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredValue(index)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLabelClick(index)}
                className={`px-1 py-0 h-auto text-xs ${
                  index === value || index === hoveredValue
                    ? "text-blue-500 font-bold"
                    : "text-gray-500"
                }`}
              >
                {range.label}
              </Button>
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  index <= value ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Label>Selected Weight Range: {weightRanges[value].label}</Label>
      </div>
    </div>
  );
}
