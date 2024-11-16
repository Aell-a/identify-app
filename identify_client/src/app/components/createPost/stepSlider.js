"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const weightRanges = [
  { value: 0, label: "<50g" },
  { value: 1, label: "50-100g" },
  { value: 2, label: "100-250g" },
  { value: 3, label: "250-500g" },
  { value: 4, label: "500-1kg" },
  { value: 5, label: "1-2kg" },
  { value: 6, label: "2-5kg" },
  { value: 7, label: ">5kg" },
];

export default function StepSlider({ value, onChange }) {
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleClick = (index) => {
    onChange(index);
  };

  const calculateProgress = () => {
    const stepSize = (100 - 5) / (weightRanges.length - 1);
    return 5 + stepSize * value;
  };

  return (
    <div className="space-y-4">
      <div className="relative pt-8">
        <Progress value={calculateProgress()} className="h-1 bg-white" />
        <div className="relative flex justify-between mt-2">
          {weightRanges.map((range, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredValue(index)}
              onMouseLeave={() => setHoveredValue(null)}
              onClick={() => handleClick(index)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClick(index)}
                className={`px-0 py-0 h-auto text-xs ${
                  index === value || index === hoveredValue
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {range.label}
              </Button>
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  index <= value ? "bg-primary" : "bg-muted"
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
