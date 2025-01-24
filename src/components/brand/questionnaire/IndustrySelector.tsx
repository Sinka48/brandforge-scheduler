import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustrySelectorProps {
  selected: string;
  onSelect: (industry: string) => void;
}

export function IndustrySelector({ selected, onSelect }: IndustrySelectorProps) {
  const industries = [
    "Technology",
    "Healthcare",
    "Education",
    "Retail",
    "Finance",
    "Entertainment",
    "Food & Beverage",
    "Travel",
    "Real Estate",
    "Other",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => onSelect(industry.toLowerCase())}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
            "border hover:bg-accent hover:text-accent-foreground",
            selected === industry.toLowerCase()
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input"
          )}
        >
          {selected === industry.toLowerCase() && (
            <Check className="mr-2 h-4 w-4" />
          )}
          {industry}
        </button>
      ))}
    </div>
  );
}