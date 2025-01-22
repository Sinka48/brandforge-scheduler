import { Smartphone, Laptop } from "lucide-react";
import { DialogHeader as Header } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogHeaderProps {
  editMode?: boolean;
  previewMode: 'mobile' | 'desktop';
  onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
}

export function DialogHeader({ 
  editMode,
  previewMode,
  onPreviewModeChange
}: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Header className="flex-1">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          {editMode ? "Edit Post" : "Create New Post"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {editMode 
            ? "Make changes to your existing post" 
            : "Create a new post for your social media platforms"
          }
        </p>
      </Header>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange('desktop')}
            className="h-8"
          >
            <Laptop className="h-4 w-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange('mobile')}
            className="h-8"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}