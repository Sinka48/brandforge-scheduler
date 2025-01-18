import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export function ColorPicker({ colors = [], onChange }: ColorPickerProps) {
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors);
  };

  return (
    <div className="space-y-4">
      <Label>Brand Colors</Label>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Popover key={index}>
            <PopoverTrigger>
              <div
                className="w-full aspect-square rounded-lg border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                style={{ backgroundColor: colors[index] || '#ffffff' }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <input
                type="color"
                value={colors[index] || '#ffffff'}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-32 h-32 cursor-pointer"
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}