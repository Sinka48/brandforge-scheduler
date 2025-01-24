import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetAudienceSelectorProps {
  selected: string;
  onSelect: (audience: string) => void;
}

export function TargetAudienceSelector({ selected, onSelect }: TargetAudienceSelectorProps) {
  const targetAudiences = [
    "Young Professionals",
    "Parents",
    "Students",
    "Business Owners",
    "Tech-Savvy",
    "Luxury Consumers",
    "Budget Shoppers",
    "Health Enthusiasts",
    "Creative Professionals",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {targetAudiences.map((audience) => (
        <button
          key={audience}
          type="button"
          onClick={() => onSelect(audience.toLowerCase())}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
            "border hover:bg-accent hover:text-accent-foreground",
            selected === audience.toLowerCase()
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input"
          )}
        >
          {selected === audience.toLowerCase() && (
            <Check className="mr-2 h-4 w-4" />
          )}
          {audience}
        </button>
      ))}
    </div>
  );
}