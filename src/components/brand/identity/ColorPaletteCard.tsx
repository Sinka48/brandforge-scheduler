import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPaletteCardProps {
  colors: string[];
  onCustomize?: (colors: string[]) => void;
}

export function ColorPaletteCard({ colors, onCustomize }: ColorPaletteCardProps) {
  const handleColorChange = (index: number, newColor: string) => {
    if (onCustomize && colors) {
      const updatedColors = [...colors];
      updatedColors[index] = newColor;
      onCustomize(updatedColors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        {colors ? (
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <div key={index} className="space-y-2">
                <Popover>
                  <PopoverTrigger>
                    <div
                      className="w-full aspect-square rounded-lg border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      style={{ backgroundColor: color }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-32 h-32 cursor-pointer"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-center font-mono">{color}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your brand color palette will appear here after generation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}