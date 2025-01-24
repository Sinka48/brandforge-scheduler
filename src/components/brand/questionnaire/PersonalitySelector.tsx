import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalitySelectorProps {
  selected: string[];
  onSelect: (traits: string[]) => void;
}

export function PersonalitySelector({ selected, onSelect }: PersonalitySelectorProps) {
  const personalityTraits = [
    "Professional",
    "Friendly",
    "Innovative",
    "Traditional",
    "Luxurious",
    "Playful",
    "Minimalist",
    "Bold",
    "Trustworthy",
    "Creative",
  ];

  const toggleTrait = (trait: string) => {
    if (selected.includes(trait)) {
      onSelect(selected.filter((t) => t !== trait));
    } else {
      onSelect([...selected, trait]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {personalityTraits.map((trait) => (
        <button
          key={trait}
          onClick={() => toggleTrait(trait)}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
            "border hover:bg-accent hover:text-accent-foreground",
            selected.includes(trait)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input"
          )}
        >
          {selected.includes(trait) && (
            <Check className="mr-2 h-4 w-4" />
          )}
          {trait}
        </button>
      ))}
    </div>
  );
}