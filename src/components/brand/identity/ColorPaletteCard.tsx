import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPaletteCardProps {
  colors: string[];
  onCustomize?: (colors: string[]) => void;
  onRegenerateAsset?: (assetType: string) => void;
}

export function ColorPaletteCard({ colors, onCustomize, onRegenerateAsset }: ColorPaletteCardProps) {
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette
          </CardTitle>
          {onRegenerateAsset && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerateAsset('colors')}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {colors ? (
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <div key={index} className="space-y-2">
                <Popover>
                  <PopoverTrigger>
                    <div
                      className="w-full aspect-square rounded-lg border cursor-pointer hover:ring-2 hover:ring-primary transition-all relative group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                        <span className="text-xs text-white font-medium">Edit</span>
                      </div>
                    </div>
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
                <div className="space-y-1">
                  <p className="text-xs text-center font-mono">{color}</p>
                  <div className="text-xs text-center text-muted-foreground">
                    {index === 0 ? "Primary" : index === 1 ? "Secondary" : `Accent ${index - 1}`}
                  </div>
                </div>
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