import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selected: string[];
  onSelect: (colors: string[]) => void;
}

export function ColorSelector({ selected, onSelect }: ColorSelectorProps) {
  const colorOptions = [
    { name: "Blue", bg: "bg-blue-500" },
    { name: "Green", bg: "bg-green-500" },
    { name: "Red", bg: "bg-red-500" },
    { name: "Purple", bg: "bg-purple-500" },
    { name: "Yellow", bg: "bg-yellow-500" },
    { name: "Orange", bg: "bg-orange-500" },
  ];

  const toggleColor = (color: string) => {
    if (selected.includes(color)) {
      onSelect(selected.filter((c) => c !== color));
    } else {
      onSelect([...selected, color]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map(({ name, bg }) => (
        <button
          key={name}
          onClick={() => toggleColor(name)}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
            "border hover:bg-accent hover:text-accent-foreground",
            selected.includes(name)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input"
          )}
        >
          {selected.includes(name) && (
            <Check className="mr-2 h-4 w-4" />
          )}
          <span>{name}</span>
          <div className={`w-4 h-4 rounded-full ${bg} ml-2`} />
        </button>
      ))}
    </div>
  );
}