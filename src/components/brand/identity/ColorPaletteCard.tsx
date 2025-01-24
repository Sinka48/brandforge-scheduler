import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RefreshCw } from "lucide-react";

interface ColorPaletteCardProps {
  colors: string[];
  onRegenerateAsset?: (assetType: string) => void;
}

export function ColorPaletteCard({
  colors,
  onRegenerateAsset,
}: ColorPaletteCardProps) {
  const handleColorChange = (index: number, newColor: string) => {
    // Color change handler placeholder
    console.log(`Color ${index} changed to ${newColor}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Color Palette</h3>
        {onRegenerateAsset && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerateAsset("colors")}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Colors
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-2"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="h-20 w-20 rounded-lg cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      <div className="sr-only">Choose color</div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Select Color</div>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-32 h-32 cursor-pointer"
                      />
                      <div className="text-xs text-muted-foreground">
                        Click to change color
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs font-mono">{color}</p>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    {index === 0 ? "Primary" : index === 1 ? "Secondary" : `Accent ${index - 1}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}