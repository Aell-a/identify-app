import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MultiSelect({ items, selectedItems, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedItems || []);

  useEffect(() => {
    setSelected(selectedItems || []);
  }, [selectedItems]);

  const handleSelect = (item) => {
    const updatedItems = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    setSelected(updatedItems);
    onChange(updatedItems);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} className="w-full">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 text-gray-100 border-none"
        >
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select items..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 text-gray-100">
        <div
          className="max-h-[300px] overflow-y-auto custom-scrollbar"
          onWheel={(e) => (e.currentTarget.scrollTop += e.deltaY)}
        >
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
            >
              <div className="w-4 h-4 mr-2">
                {selected.includes(item) && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
              {item}
            </div>
          ))}
        </div>
      </PopoverContent>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 4px;
        }
      `}</style>
    </Popover>
  );
}
