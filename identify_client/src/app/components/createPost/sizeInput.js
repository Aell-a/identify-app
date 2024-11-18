import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const unitConversions = {
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

export default function SizeInput({ value, onChange }) {
  const [showWidth, setShowWidth] = useState(false);
  const [showDepth, setShowDepth] = useState(false);

  const handleInputChange = (dimension, inputValue) => {
    const newSize = { ...value, [dimension]: inputValue };
    onChange(newSize);
  };

  const handleUnitChange = (newUnit) => {
    const convertedSize = Object.keys(value).reduce((acc, key) => {
      if (key !== "unit") {
        const cmValue = parseFloat(value[key]) * unitConversions[value.unit];
        acc[key] = (cmValue / unitConversions[newUnit]).toFixed(2);
      }
      return acc;
    }, {});
    onChange({ ...convertedSize, unit: newUnit });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={value.length}
          onChange={(e) => handleInputChange("length", e.target.value)}
          placeholder="Length"
          className="bg-gray-700 text-gray-100 border-none"
        />
        <Select value={value.unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-24 border-none">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="in">in</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showWidth ? (
        <Input
          type="number"
          value={value.width}
          onChange={(e) => handleInputChange("width", e.target.value)}
          placeholder="Width"
          className="bg-gray-700 text-gray-100 border-none"
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowWidth(true)}
          className="w-24 bg-gray-700 text-gray-100 border-none mr-2"
        >
          Add Width
        </Button>
      )}
      {showDepth ? (
        <Input
          type="number"
          value={value.depth}
          onChange={(e) => handleInputChange("depth", e.target.value)}
          placeholder="Depth"
          className="bg-gray-700 text-gray-100 border-none  "
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowDepth(true)}
          className="w-24 bg-gray-700 text-gray-100 border-none"
        >
          Add Depth
        </Button>
      )}
    </div>
  );
}
