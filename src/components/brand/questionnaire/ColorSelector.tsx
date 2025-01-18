import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {colorOptions.map(({ name, bg }) => (
        <Button
          key={name}
          variant="outline"
          className={`h-auto py-4 px-4 flex items-center justify-between ${
            selected.includes(name) ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => toggleColor(name)}
        >
          <span>{name}</span>
          <div className={`w-6 h-6 rounded-full ${bg} ml-2`}>
            {selected.includes(name) && (
              <Check className="w-4 h-4 text-white m-1" />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}