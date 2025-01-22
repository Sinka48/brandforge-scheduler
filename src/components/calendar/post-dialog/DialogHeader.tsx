import { Smartphone, Laptop } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PLATFORMS } from "@/constants/platforms";

interface DialogHeaderProps {
  editMode?: boolean;
  previewMode: "mobile" | "desktop";
  onPreviewModeChange: (mode: "mobile" | "desktop") => void;
}

export function DialogHeader({ 
  editMode,
  previewMode,
  onPreviewModeChange
}: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <DialogTitle className="text-xl font-semibold">
          {editMode ? "Edit Post" : "Create New Post"}
        </DialogTitle>
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