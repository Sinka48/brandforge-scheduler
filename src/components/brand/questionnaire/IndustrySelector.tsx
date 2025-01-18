import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {industries.map((industry) => (
        <Button
          key={industry}
          variant={selected === industry.toLowerCase() ? "default" : "outline"}
          className="h-auto py-4 px-4 flex items-center justify-center text-center"
          onClick={() => onSelect(industry.toLowerCase())}
        >
          {selected === industry.toLowerCase() && (
            <Check className="mr-2 h-4 w-4" />
          )}
          {industry}
        </Button>
      ))}
    </div>
  );
}