import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const weightRanges = [
  { min: 5, max: 10, step: 1, unit: "g" },
  { min: 10, max: 50, step: 5, unit: "g" },
  { min: 50, max: 200, step: 25, unit: "g" },
  { min: 200, max: 500, step: 50, unit: "g" },
  { min: 500, max: 1000, step: 100, unit: "g" },
  { min: 1, max: 5, step: 0.5, unit: "kg" },
];

export default function WeightSlider({ value, unit, onChange }) {
  const [currentRange, setCurrentRange] = useState(weightRanges[0]);
  const [localValue, setLocalValue] = useState(value);
  const [localUnit, setLocalUnit] = useState(unit);

  useEffect(() => {
    const range = weightRanges.find(
      (range) =>
        (localUnit === "g" &&
          localValue >= range.min &&
          localValue <= range.max) ||
        (localUnit === "kg" &&
          localValue >= range.min / 1000 &&
          localValue <= range.max / 1000)
    );
    if (range) setCurrentRange(range);
  }, [localValue, localUnit]);

  const handleSliderChange = (newValue) => {
    setLocalValue(newValue[0]);
    onChange(newValue[0], localUnit);
  };

  const handleUnitChange = (newUnit) => {
    setLocalUnit(newUnit);
    const convertedValue =
      newUnit === "kg" ? localValue / 1000 : localValue * 1000;
    setLocalValue(convertedValue);
    onChange(convertedValue, newUnit);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Slider
          value={[localValue]}
          min={currentRange.min}
          max={currentRange.max}
          step={currentRange.step}
          onValueChange={handleSliderChange}
          className="flex-grow"
        />
        <span className="w-20 text-right">
          {localValue} {localUnit}
        </span>
      </div>
      <Select value={localUnit} onValueChange={handleUnitChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="g">Grams</SelectItem>
          <SelectItem value="kg">Kilograms</SelectItem>
          <SelectItem value="lb">Pounds</SelectItem>
          <SelectItem value="oz">Ounces</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
