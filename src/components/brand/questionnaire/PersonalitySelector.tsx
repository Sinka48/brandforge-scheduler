import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {personalityTraits.map((trait) => (
        <Button
          key={trait}
          variant={selected.includes(trait) ? "default" : "outline"}
          className="h-auto py-4 px-4 flex items-center justify-center text-center"
          onClick={() => toggleTrait(trait)}
        >
          {selected.includes(trait) && <Check className="mr-2 h-4 w-4" />}
          {trait}
        </Button>
      ))}
    </div>
  );
}