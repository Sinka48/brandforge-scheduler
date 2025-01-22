import { Smartphone, Laptop } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PLATFORMS } from "@/constants/platforms";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DialogHeaderProps {
  editMode?: boolean;
  previewMode: "mobile" | "desktop";
  onPreviewModeChange: (mode: "mobile" | "desktop") => void;
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string) => void;
}

export function DialogHeader({ 
  editMode,
  previewMode,
  onPreviewModeChange,
  selectedPlatforms,
  onPlatformToggle
}: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <DialogTitle className="text-xl font-semibold mb-4">
          {editMode ? "Edit Post" : "Create New Post"}
        </DialogTitle>
        
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLATFORMS.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              const Icon = platform.icon;
              
              return (
                <Tooltip key={platform.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => onPlatformToggle(platform.id)}
                      className="relative w-full h-10 px-4"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">{platform.name}</span>
                        {isSelected && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                          >
                            ✓
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs text-muted-foreground">
                      {isSelected ? `Remove from ${platform.name}` : `Add to ${platform.name}`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <ToggleGroup 
          type="single" 
          value={previewMode}
          onValueChange={(value) => value && onPreviewModeChange(value as "mobile" | "desktop")}
        >
          <ToggleGroupItem value="mobile" aria-label="Mobile preview">
            <Smartphone className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="desktop" aria-label="Desktop preview">
            <Laptop className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}