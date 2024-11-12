import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MultiSelect({ items, selectedItems, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    onChange(updatedItems);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 text-gray-100"
        >
          {selectedItems.length > 0
            ? `${selectedItems.length} selected`
            : "Select items..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="bg-gray-800 text-gray-100">
          <CommandInput placeholder="Search items..." className="bg-gray-700" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item}
                onSelect={() => handleSelect(item)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedItems.includes(item) ? "opacity-100" : "opacity-0"
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
