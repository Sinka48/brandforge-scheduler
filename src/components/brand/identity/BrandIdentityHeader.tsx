import { Button } from "@/components/ui/button";
import { Loader2, Save, Trash2, Wand2 } from "lucide-react";

interface BrandIdentityHeaderProps {
  brandExists: boolean;
  isGenerating: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onGenerate: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function BrandIdentityHeader({
  brandExists,
  isGenerating,
  isSaving,
  isDeleting,
  onGenerate,
  onSave,
  onDelete,
}: BrandIdentityHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand Identity</h1>
        <p className="text-muted-foreground">
          Review and customize your brand identity
        </p>
      </div>
      <div className="flex gap-2">
        {brandExists && (
          <>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Brand
            </Button>
            <Button 
              variant="outline"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Brand
            </Button>
          </>
        )}
        <Button onClick={onGenerate} disabled={isGenerating}>
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Wand2 className="mr-2 h-4 w-4" />
          {brandExists ? "Regenerate" : "Generate"} Brand Identity
        </Button>
      </div>
    </div>
  );
}