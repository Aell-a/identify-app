"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StepSlider({ value, onChange }) {
  const [hoveredValue, setHoveredValue] = useState(null);

  const weightRanges = [
    { value: "<50g", label: "<50g" },
    { value: "50-100g", label: "50-100g" },
    { value: "100-250g", label: "100-250g" },
    { value: "250-500g", label: "250-500g" },
    { value: "500-1kg", label: "500-1kg" },
    { value: "1-2kg", label: "1-2kg" },
    { value: "2-5kg", label: "2-5kg" },
    { value: ">5kg", label: ">5kg" },
  ];

  const handleClick = (index) => {
    onChange(weightRanges[index].value);
  };

  const calculateProgress = () => {
    const stepSize = (100 - 5) / (weightRanges.length - 1);
    const currentIndex = weightRanges.findIndex(
      (range) => range.value === value
    );
    return 5 + stepSize * (currentIndex !== -1 ? currentIndex : 0);
  };

  const getCurrentIndex = () => {
    return weightRanges.findIndex((range) => range.value === value) || 0;
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
                  range.value === value || index === hoveredValue
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {range.label}
              </Button>
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  index <= getCurrentIndex() ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Label>Selected Weight Range: {value}</Label>
      </div>
    </div>
  );
}
